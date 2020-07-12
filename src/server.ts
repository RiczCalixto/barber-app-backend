import 'reflect-metadata';
import express from 'express';
import { routes } from './routes';
import './database';
import updloadConfig from './config/upload';

const app = express();

app.use(express.json());
app.use('/files', express.static(updloadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('Server up!');
});
