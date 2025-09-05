import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(2, 60)
  title: string;
  @IsString()
  @Length(2, 500)
  body: string;
}
