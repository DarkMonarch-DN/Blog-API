import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { TResponsePostList } from 'src/common/types/post.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Post | null> {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  async findAll(page: number, limit: number): Promise<TResponsePostList> {
    const [data, total] = await Promise.all([
      this.prismaService.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.post.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findUserPosts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TResponsePostList> {
    const [data, total] = await Promise.all([
      this.prismaService.post.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.post.count({
        where: { userId },
      }),
    ]);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async create(post: {
    title: string;
    body: string;
    userId: string;
  }): Promise<Post> {
    return this.prismaService.post.create({
      data: post,
    });
  }
  async update(
    id: string,
    post: {
      title?: string;
      body?: string;
      like?: number;
      dislike?: number;
    },
  ): Promise<Post> {
    return this.prismaService.post.update({
      where: { id },
      data: post,
    });
  }
  async remove(id: string): Promise<Post> {
    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
