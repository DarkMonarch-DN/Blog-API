import { Injectable } from '@nestjs/common';
import { ResetToken } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<ResetToken | null> {
    return this.prismaService.resetToken.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<ResetToken | null> {
    return this.prismaService.resetToken.findUnique({
      where: { userId },
    });
  }
  async create(token: {
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<ResetToken> {
    return this.prismaService.resetToken.create({
      data: token,
    });
  }
  async removeByUserId(userId: string): Promise<ResetToken> {
    return this.prismaService.resetToken.delete({
      where: { userId },
    });
  }
}
