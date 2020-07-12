import { Appointment } from '../models/Appointment.model';
import { startOfHour, parseISO } from 'date-fns';
import { AppointmentsRepository } from '../repositories/Appointments.repository';
import { getCustomRepository } from 'typeorm';
import { RouteError } from '../errors/RouteError';

interface AppointmentDTO {
  date: string;
  provider_id: string;
}

export class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: AppointmentDTO): Promise<Appointment> {
    if (!date) {
      throw new RouteError('Date not found');
    } else {
      const appointmentsRepository = getCustomRepository(
        AppointmentsRepository,
      );
      const parsedDate = parseISO(date);
      const appointmentDate = startOfHour(parsedDate);
      const dateAlreadyExists = await appointmentsRepository.findByDate(
        appointmentDate,
      );

      if (dateAlreadyExists) {
        throw new RouteError(
          'This appointment is already taken, pelase choose another date.',
        );
      }

      const appointment = appointmentsRepository.create({
        provider_id,
        date: appointmentDate,
      });

      await appointmentsRepository.save(appointment);

      return appointment;
    }
  }
}
