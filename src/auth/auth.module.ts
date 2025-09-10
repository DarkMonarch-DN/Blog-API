import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { RegisterService } from './sub-services/register.service';
import { VerifyRepository } from './repository/verify-token.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoginService } from './sub-services/login.service';
import { RefreshRepository } from './repository/refresh-token.repository';
import { ResetRepository } from './repository/reset-token.repository';
import { PasswordService } from './sub-services/password.service';

@Module({
  imports: [UserModule, ConfigModule, MailModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterService,
    LoginService,
    PasswordService,
    VerifyRepository,
    RefreshRepository,
    ResetRepository,
  ],
})
export class AuthModule {}
