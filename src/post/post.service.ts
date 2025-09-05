import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { TUserSub } from 'src/common/types/user.types';
import { CreatePostDto } from './dto/create-post-dto';
import { UserRepository } from 'src/user/user.repository';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { TResponsePostList } from 'src/common/types/post.types';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(user: TUserSub, dto: CreatePostDto): Promise<Post> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    const post = await this.postRepo.create({
      ...dto,
      userId: existingUser.id,
    });
    return post;
  }

  async findUserPosts(
    user: TUserSub,
    page: number,
    limit: number,
  ): Promise<TResponsePostList> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.postRepo.findUserPosts(user.id, page, limit);
  }

  async findAll(page: number, limit: number): Promise<TResponsePostList> {
    return this.postRepo.findAll(page, limit);
  }

  async findOne(postId: string): Promise<Post | null> {
    return this.postRepo.findById(postId);
  }

  async update(
    user: TUserSub,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<Post> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post.userId !== user.id) {
      throw new ForbiddenException(
        'Недостаточно прав для изменения этого поста',
      );
    }

    return this.postRepo.update(postId, dto);
  }

  async remove(user: TUserSub, postId: string): Promise<Post> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post.userId !== user.id) {
      throw new ForbiddenException(
        'Недостаточно прав для удаления этого поста',
      );
    }

    return this.postRepo.remove(postId);
  }

  async adminRemove(user: TUserSub, postId: string): Promise<Post> {
    const existingUser = await this.userRepo.findById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return this.postRepo.remove(postId);
  }
}
