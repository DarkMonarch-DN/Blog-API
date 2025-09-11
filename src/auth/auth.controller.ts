import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TResponse } from 'src/common/types/router.types';
import { Response, Request } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';
import { VerificationDto } from './dto/resend-verification.dto';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { TUserSub } from 'src/common/types/user.types';
import { ForgotDto } from './dto/forgot-password.dto';
import { ResetDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<TResponse> {
    return this.authService.register(dto);
  }
  @Post('/resend-verification')
  async resendVerification(@Body() dto: VerificationDto): Promise<TResponse> {
    return this.authService.resendVerification(dto);
  }
  @Get('/verify')
  async verifyEmail(
    @Query('vid') vid: string,
    @Query('token') token: string,
  ): Promise<TResponse> {
    return this.authService.verifyEmail(vid, token);
  }

  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TResponse> {
    return this.authService.login(dto, res);
  }

  @Auth()
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TResponse> {
    return this.authService.refresh(req, res);
  }

  @Auth()
  @Post('/logout')
  async logout(
    @Authorized() user: TUserSub,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TResponse> {
    return this.authService.logout(user, res);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotDto): Promise<TResponse> {
    return this.authService.forgotPassword(dto);
  }

  @Post('/reset-password')
  async resetPassword(
    @Query('rid') resetId: string,
    @Query('token') token: string,
    @Body() dto: ResetDto,
  ): Promise<TResponse> {
    return this.authService.resetPassword(resetId, token, dto);
  }
}
