import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, PrismaModule, PostModule, MailModule],
})
export class AppModule {}
