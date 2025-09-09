import { Injectable } from '@nestjs/common';
import { VerificationToken } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerifyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(token: string): Promise<VerificationToken | null> {
    return this.prismaService.verificationToken.findUnique({
      where: { token },
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
  async remove(token: string): Promise<VerificationToken> {
    return this.prismaService.verificationToken.delete({
      where: { token },
    });
  }
  async removeByUserId(userId: string): Promise<VerificationToken> {
    return this.prismaService.verificationToken.delete({
      where: { userId },
    });
  }
}
