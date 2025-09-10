import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { TResponse } from 'src/common/types/router.types';
import { UserRepository } from 'src/user/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { v4 } from 'uuid';
import { VerifyRepository } from '../repository/verify-token.repository';
import { VerificationDto } from '../dto/resend-verification.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly verifyRepo: VerifyRepository,
  ) {}

  async register(dto: RegisterDto): Promise<TResponse> {
    const { name, email, password } = dto;

    const isExists = await this.userRepo.findByEmail(email);
    if (isExists) {
      throw new ConflictException('Пользователь с данным email уже существует');
    }
    const hashedPassword = await hash(password, 10);

    const user = await this.userRepo.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const verificationToken = await hash(v4(), 10);

    await this.verifyRepo.create({
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 3600000),
      userId: user.id,
    });

    await this.mailService.send(
      email,
      'Email Verification',
      `
        <h1>Пожалуйста, подтвердите почту переходом по ссылке</h1>
        <a href="${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/verify?token=${verificationToken}" style="text-decoration: none; font-size: 1.4rem; color: teal">Подтвердить </a>
    `,
    );

    return {
      success: true,
      message: 'Регистрация прошла успешна',
    };
  }
  async resendVerification(dto: VerificationDto): Promise<TResponse> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (existingUser.isActivate) {
      throw new BadRequestException('Пользователь уже подтвердил почту');
    }
    await this.verifyRepo.removeByUserId(existingUser.id);

    const verificationToken = await hash(v4(), 10);

    await this.verifyRepo.create({
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 3600000),
      userId: existingUser.id,
    });
    await this.mailService.send(
      dto.email,
      'Email Verification',
      `
        <h1>Пожалуйста, подтвердите почту переходом по ссылке</h1>
        <a href="${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/verify?token=${verificationToken}" style="text-decoration: none; font-size: 1.4rem; color: teal">Подтвердить </a>
    `,
    );
    return {
      success: true,
      message: 'Письмо с кодом подтверждения отправлено на вашу почту',
    };
  }

  async verifyEmail(token: string): Promise<TResponse> {
    const existingToken = await this.verifyRepo.find(token);
    if (
      !existingToken ||
      new Date(Date.now()) > existingToken.expiresAt ||
      !(await compare(token, existingToken.token))
    ) {
      throw new BadRequestException('Данный токен не действителен');
    }
    await this.userRepo.update(existingToken.userId, { isActivate: true });
    await this.verifyRepo.remove(token);
    return {
      success: true,
      message: 'Почта успешно подтверждена',
    };
  }
}
