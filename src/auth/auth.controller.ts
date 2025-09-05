import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TResponse } from 'src/common/types/router.types';
import { Response } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<TResponse> {
    return this.authService.register(dto);
  }

  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TResponse> {
    return this.authService.login(dto, res);
  }

  @Auth()
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<TResponse> {
    return this.authService.logout(res);
  }
}
