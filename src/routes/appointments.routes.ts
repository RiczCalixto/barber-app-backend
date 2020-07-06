import { Router } from 'express';
import { AppointmentsRepository } from '../repositories/Appointments.repository';
import { CreateAppointmentService } from '../services/CreateAppointment.service';
import { getCustomRepository } from 'typeorm';

const appointmentsRouter = Router();

appointmentsRouter.get('/', (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;
    const createAppointmentService = new CreateAppointmentService();
    const appointment = createAppointmentService.execute({
      provider,
      date,
    });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
