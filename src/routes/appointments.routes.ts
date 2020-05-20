import { Router } from 'express';
import { uuid } from 'uuidv4';

const appointmentsRouter = Router();

const appointments = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const apointment = {
    id: uuid(),
    provider,
    date,
  };

  appointments.push(apointment);

  return response.json(apointment);
});

export default appointmentsRouter;
