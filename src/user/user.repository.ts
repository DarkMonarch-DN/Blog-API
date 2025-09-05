import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async create(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  async update(id: string, user: {}): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: user,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
