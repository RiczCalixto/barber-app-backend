import { Router } from 'express';
import { CreateUserService } from '../services/CreateUser.service';
import { getRepository } from 'typeorm';
import { User } from '../models/User.model';
import { checkAuthentication } from '../middlewares/checkAuthentication';
import multer from 'multer';
import uploadConfig from '../config/upload';
import { UpdateUserAvatarService } from '../services/UpdateUserAvatar.service';
import { RouteError } from '../errors/RouteError';

export const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();
  const user = await createUser.execute({ name, email, password });

  delete user.password;

  return response.json(user);
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

usersRouter.patch(
  '/avatar',
  checkAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json({ user });
  },
);
