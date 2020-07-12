import { getRepository } from 'typeorm';
import { User } from '../models/User.model';
import { compare } from 'bcryptjs';

interface AuthenticationDTO {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
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

    if (isWrongPassword) throw new Error('Wrong email or password');

    return { user };
  }
}
