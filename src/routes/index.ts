import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import userRouter from './users.routes';

export const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', userRouter);
