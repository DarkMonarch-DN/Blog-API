import { IsEmail } from 'class-validator';

export class ForgotDto {
  @IsEmail()
  email: string;
}
