import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import { AppointmentsRepository } from '../repositories/Appointments.repository';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;
  const parsedDate = startOfHour(parseISO(date));
  const dateAlreadyExists = appointmentsRepository.findByDate(parsedDate);

  if (!date) {
    return response.status(400).json({
      message: 'Data not found',
    });
  }

  if (dateAlreadyExists) {
    return response.status(400).json({
      message: 'This appointment is already taken, pelase choose another date.',
    });
  }
  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
