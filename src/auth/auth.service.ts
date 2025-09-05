import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcrypt';
import { TResponse } from 'src/common/types/router.types';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<TResponse> {
    const { name, email, password } = dto;

    const isExists = await this.userRepo.findByEmail(email);
    if (isExists) {
      throw new ConflictException('Пользователь с данным email уже существует');
    }
    const hashedPassword = await hash(password, 10);

    await this.userRepo.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'Регистрация прошла успешно',
    };
  }

  async login(dto: LoginDto, res: Response): Promise<TResponse> {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    const isPassword = await compare(password, user.password);
    if (!isPassword) {
      throw new BadRequestException('Неверный логин или пароль');
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      {
        expiresIn: '7d',
      },
    );

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 604800000,
    });
    return {
      success: true,
      message: `Пользователь ${user.name} успешно вошел в систему`,
    };
  }

  async logout(res: Response): Promise<TResponse> {
    res.clearCookie('accessToken');
    return {
      success: true,
      message: 'Пользователь успешно вышел из системы',
    };
  }
}
