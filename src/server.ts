import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import { routes } from './routes';
import './database';
import updloadConfig from './config/upload';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

app.use(express.json());
app.use('/files', express.static(updloadConfig.directory));
app.use(routes);
app.use(globalErrorHandler);

app.listen(3333, () => {
  console.log('Server up!');
});
