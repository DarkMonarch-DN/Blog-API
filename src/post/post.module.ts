import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
