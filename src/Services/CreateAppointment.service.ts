import { Appointment } from '../models/Appointment.model';
import { startOfHour, parseISO } from 'date-fns';
import { AppointmentsRepository } from '../repositories/Appointments.repository';

interface RequestDTO {
  date: string;
  provider: string;
}

export class CreateAppointmentService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  public execute({ provider, date }: RequestDTO): Appointment {
    if (!date) {
      throw Error('Data not found');
    } else {
      const parsedDate = parseISO(date);
      const appointmentDate = startOfHour(parsedDate);
      const dateAlreadyExists = this.appointmentsRepository.findByDate(
        appointmentDate,
      );
      if (dateAlreadyExists) {
        throw Error(
          'This appointment is already taken, pelase choose another date.',
        );
      }

      return this.appointmentsRepository.create({
        provider,
        date: appointmentDate,
      });
    }
  }
}
