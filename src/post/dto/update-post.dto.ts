import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @Length(2, 60)
  title?: string;
  @IsOptional()
  @IsString()
  @Length(2, 500)
  body?: string;
}
