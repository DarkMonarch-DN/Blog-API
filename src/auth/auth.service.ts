import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TResponse } from 'src/common/types/router.types';
import { Response, Request } from 'express';
import { RegisterService } from './sub-services/register.service';
import { VerificationDto } from './dto/resend-verification.dto';
import { LoginService } from './sub-services/login.service';
import { TUserSub } from 'src/common/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  async register(dto: RegisterDto): Promise<TResponse> {
    return this.registerService.register(dto);
  }

  async resendVerification(dto: VerificationDto): Promise<TResponse> {
    return this.registerService.resendVerification(dto);
  }

  async verifyEmail(token: string): Promise<TResponse> {
    return this.registerService.verifyEmail(token);
  }

  async login(dto: LoginDto, res: Response): Promise<TResponse> {
    return this.loginService.login(dto, res);
  }

  async refresh(req: Request, res: Response): Promise<TResponse> {
    return this.loginService.refresh(req, res);
  }

  async logout(user: TUserSub, res: Response): Promise<TResponse> {
    return this.loginService.logout(user, res);
  }
}
