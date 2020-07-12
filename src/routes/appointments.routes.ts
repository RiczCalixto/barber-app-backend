import { Router } from 'express';
import { AppointmentsRepository } from '../repositories/Appointments.repository';
import { CreateAppointmentService } from '../services/CreateAppointment.service';
import { getCustomRepository } from 'typeorm';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;
    const createAppointmentService = new CreateAppointmentService();
    const appointment = await createAppointmentService.execute({
      provider_id,
      date,
    });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
