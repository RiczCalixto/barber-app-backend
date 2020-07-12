import { getRepository } from 'typeorm';
import { User } from '../models/User.model';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthenticationDTO {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_SECRET = '25c7894d438d3672695a6144e0f116c1';

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

    if (isWrongPassword) throw new Error('Wrong email or password');

    const token = sign({}, TOKEN_SECRET, {
      subject: user.id,
      expiresIn: '2d',
    });

    return { user, token };
  }
}
