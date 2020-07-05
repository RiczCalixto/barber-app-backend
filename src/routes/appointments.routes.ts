import { Router } from 'express';
import { AppointmentsRepository } from '../repositories/Appointments.repository';
import { CreateAppointmentService } from '../services/CreateAppointment.service';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;
    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository,
    );
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
