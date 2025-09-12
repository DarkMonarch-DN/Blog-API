import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TUserSub } from 'src/common/types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(
    user: TUserSub,
  ): Promise<Omit<User, 'password' | 'isActivate'>> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Не авторизован');
    }
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };
  }

  async findAll(user: TUserSub): Promise<User[]> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.userRepo.findAll();
  }

  async remove(user: TUserSub, id: string): Promise<User> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.userRepo.remove(id);
  }

  async editProfile(user: TUserSub, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    await this.userRepo.update(user.id, dto);

    return this.userRepo.update(user.id, dto);
  }
}
