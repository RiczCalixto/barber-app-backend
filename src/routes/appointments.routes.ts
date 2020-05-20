import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointment.model';

const appointmentsRouter = Router();

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));
  const dateAlreadyExists = appointments.find(appointment =>
    isEqual(parsedDate, appointment.date),
  );

  if (dateAlreadyExists) {
    return response.status(400).json({
      message: 'This appointment is already taken, please select another date',
    });
  }

  const apointment = new Appointment(provider, parsedDate);

  appointments.push(apointment);

  return response.json(apointment);
});

export default appointmentsRouter;
