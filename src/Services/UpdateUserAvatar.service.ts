import { User } from '../models/User.model';
import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';
import { RouteError } from '../errors/RouteError';

interface AvatarDTO {
  user_id: string;
  avatarFilename: string;
}

export class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: AvatarDTO): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    if (!user)
      throw new RouteError('Only authenticated users can change avatar.', 401);

    if (user.avatar) this.deleteExistentAvatar(user.avatar);

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }

  private async deleteExistentAvatar(avatar: string) {
    const userAvatarFilePath = path.join(uploadConfig.directory, avatar);
    const isAvatarAlreadyCreated = await fs.promises.stat(userAvatarFilePath);
    if (isAvatarAlreadyCreated) await fs.promises.unlink(userAvatarFilePath);
  }
}
