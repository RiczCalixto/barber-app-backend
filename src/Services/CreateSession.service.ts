import { getRepository } from 'typeorm';
import { User } from '../models/User.model';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { RouteError } from '../errors/RouteError';

interface AuthenticationDTO {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export class CreateSessionService {
  public async execute({
    email,
    password,
  }: AuthenticationDTO): Promise<AuthResponse> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({ where: { email } });
    const isWrongEmail = !user;

    if (isWrongEmail) throw new Error('Wrong email or password');

    const isSamePassword = await compare(password, user.password);
    const isWrongPassword = !isSamePassword;

    if (isWrongPassword) throw new RouteError('Wrong email or password', 401);

    const { tokenSecret, expiresIn } = authConfig.jwt;

    const token = sign({}, tokenSecret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}
