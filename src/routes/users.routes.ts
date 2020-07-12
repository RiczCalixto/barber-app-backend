import { Router } from 'express';
import { CreateUserService } from '../services/CreateUser.service';
import { getRepository } from 'typeorm';
import { User } from '../models/User.model';

export const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();

  const usersWithoutPassword = users.map(user => {
    delete user.password;
    return user;
  });

  return response.json(usersWithoutPassword);
});

