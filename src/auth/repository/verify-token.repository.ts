import { Injectable } from '@nestjs/common';
import { VerificationToken } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerifyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<VerificationToken | null> {
    return this.prismaService.verificationToken.findUnique({
      where: { id },
      include: { user: true },
    });
  }
  async create(token: {
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<VerificationToken> {
    return this.prismaService.verificationToken.create({
      data: token,
    });
  }
  async remove(id: string): Promise<VerificationToken> {
    return this.prismaService.verificationToken.delete({
      where: { id },
    });
  }
  async removeByUserId(userId: string): Promise<VerificationToken> {
    return this.prismaService.verificationToken.delete({
      where: { userId },
    });
  }
}
