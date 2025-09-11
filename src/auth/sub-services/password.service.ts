import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { ForgotDto } from '../dto/forgot-password.dto';
import { ResetDto } from '../dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { TResponse } from 'src/common/types/router.types';
import { ResetRepository } from '../repository/reset-token.repository';
import { v4 } from 'uuid';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly resetRepo: ResetRepository,
  ) {}

  async forgotPassword(dto: ForgotDto): Promise<TResponse> {
    const { email } = dto;
    const user = await this.userRepo.findByEmail(email);
    if (user) {
      const existingToken = await this.resetRepo.findByUserId(user.id);
      if (existingToken) {
        await this.resetRepo.removeByUserId(user.id);
      }

      const resetToken = v4();
      const newToken = await this.resetRepo.create({
        token: await hash(resetToken, 10),
        expiresAt: new Date(Date.now() + 24 * 3600000),
        userId: user.id,
      });

      await this.mailService.send(
        email,
        'Подтвердите смену пароля',
        `
        <h1>Пожалуйста, подтвердите смену пароля</h1>
        <a href="${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/reset-password?rid=${newToken.id}&token=${resetToken}" style="text-decoration: none; font-size: 1.4rem; color: teal">Подтвердить ${resetToken}</a>
    `,
      );
    }

    return {
      success: true,
      message: 'Письмо отправлено. Проверьте почту.',
    };
  }

  async resetPassword(resetId: string, token: string, dto: ResetDto) {
    const { password } = dto;
    const existingToken = await this.resetRepo.findById(resetId);
    if (
      !existingToken ||
      Date.now() > existingToken.expiresAt.getTime() ||
      !(await compare(token, existingToken.token))
    ) {
      throw new BadRequestException('Токен не валиден');
    }

    const existingUser = await this.userRepo.findById(existingToken.userId);
    if (!existingUser) {
      throw new BadRequestException('Пользователь не найден');
    }

    await this.resetRepo.removeByUserId(existingUser.id);

    await this.userRepo.update(existingUser.id, {
      password: await hash(password, 10),
    });

    return {
      success: true,
      message: 'Пароль успешно изменен',
    };
  }
}
