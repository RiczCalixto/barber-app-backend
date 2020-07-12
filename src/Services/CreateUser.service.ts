import { User } from '../models/User.model';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { RouteError } from '../errors/RouteError';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  public async execute({ name, email, password }: UserDTO): Promise<User> {
    const usersRepository = getRepository(User);
    const hasEmailAlready = await usersRepository.findOne({
      where: { email },
    });

    if (hasEmailAlready) throw new RouteError('Email address already exists.');

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}
