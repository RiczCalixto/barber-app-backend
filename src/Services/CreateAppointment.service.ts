import { Appointment } from '../models/Appointment.model';
import { startOfHour, parseISO } from 'date-fns';
import { AppointmentsRepository } from '../repositories/Appointments.repository';
import { getCustomRepository } from 'typeorm';

interface RequestDTO {
  date: string;
  provider: string;
}

export class CreateAppointmentService {
  public async execute({ provider, date }: RequestDTO): Promise<Appointment> {
    if (!date) {
      throw Error('Data not found');
    } else {
      const appointmentsRepository = getCustomRepository(
        AppointmentsRepository,
      );
      const parsedDate = parseISO(date);
      const appointmentDate = startOfHour(parsedDate);
      const dateAlreadyExists = appointmentsRepository.findByDate(
        appointmentDate,
      );

      if (dateAlreadyExists) {
        throw Error(
          'This appointment is already taken, pelase choose another date.',
        );
      }

      const appointment = appointmentsRepository.create({
        provider,
        date: appointmentDate,
      });

      await appointmentsRepository.save(appointment);

      return appointment;
    }
  }
}
