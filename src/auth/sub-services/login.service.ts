import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { Response, Request } from 'express';
import { compare, hash } from 'bcrypt';
import { TResponse } from 'src/common/types/router.types';
import { LoginDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RefreshRepository } from '../repository/refresh-token.repository';
import { TUserSub } from 'src/common/types/user.types';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly refreshRepo: RefreshRepository,
  ) {}

  async login(dto: LoginDto, res: Response): Promise<TResponse> {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await compare(password, user.password))) {
      throw new BadRequestException('Неверный логин или пароль');
    }
    if (!user.isActivate) {
      throw new BadRequestException('Почта не подтверждена');
    }

    await this.refreshRepo.removeByUserId(user.id);
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      {
        expiresIn: '7d',
      },
    );

    await this.refreshRepo.create({
      token: await hash(refreshToken, 10),
      userId: user.id,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 15 * 60000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 7 * 24 * 3600000,
    });
    return {
      success: true,
      message: `Пользователь ${user.name} успешно вошел в систему`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async refresh(req: Request, res: Response): Promise<TResponse> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    let payload: { id: string; iat: number; exp: number };
    try {
      payload = jwt.verify(
        refreshToken,
        this.configService.get<string>('JWT_SECRET') as string,
      ) as { id: string; iat: number; exp: number };
    } catch {
      throw new UnauthorizedException('Токен невалиден');
    }

    const existingUser = await this.userRepo.findById(payload.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // сверяем хэш токена
    const existingToken = await this.refreshRepo.findByUserId(payload.id);
    const isValid =
      existingToken && (await compare(refreshToken, existingToken.token));
    if (!isValid) {
      throw new UnauthorizedException('Токен отозван или устарел');
    }

    // удаляем старый refresh
    await this.refreshRepo.removeByUserId(existingUser.id);

    // создаём новые токены
    const accessToken = jwt.sign(
      { id: existingUser.id, role: existingUser.role },
      this.configService.get<string>('JWT_SECRET') as string,
      { expiresIn: '15m' },
    );

    const newRefreshToken = jwt.sign(
      { id: existingUser.id },
      this.configService.get<string>('JWT_SECRET') as string,
      { expiresIn: '7d' },
    );

    // сохраняем хэш нового токена
    const hashedToken = await hash(newRefreshToken, 10);
    await this.refreshRepo.create({
      token: hashedToken,
      userId: existingUser.id,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 15 * 60000,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 7 * 24 * 3600000,
    });

    return { success: true, message: 'Токены обновлены' };
  }

  async logout(user: TUserSub, res: Response): Promise<TResponse> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.refreshRepo.removeByUserId(user.id);
    return {
      success: true,
      message: 'Пользователь успешно вышел из системы',
    };
  }
}
