import { Injectable } from '@nestjs/common';
import { RefreshToken, VerificationToken } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(token: string): Promise<RefreshToken | null> {
    return this.prismaService.refreshToken.findFirst({
      where: { token },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.prismaService.refreshToken.findUnique({
      where: { userId },
      include: { user: true },
    });
  }
  async create(token: {
    token: string;
    userId: string;
  }): Promise<RefreshToken> {
    return this.prismaService.refreshToken.create({
      data: token,
    });
  }
  //   async remove(id: string): Promise<RefreshToken> {
  //     return this.prismaService.refreshToken.delete({
  //       where: { id },
  //     });
  //   }
  async removeByUserId(userId: string): Promise<RefreshToken> {
    return this.prismaService.refreshToken.delete({
      where: { userId },
    });
  }
}
