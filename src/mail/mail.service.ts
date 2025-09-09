import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend;
  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async send(to: string, subject: string, html: string) {
    try {
      await this.resend.emails.send({
        from: this.configService.getOrThrow<string>('EMAIL_FROM'),
        to,
        subject,
        html,
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('НЕ получилось отправить email');
    }
  }
}
