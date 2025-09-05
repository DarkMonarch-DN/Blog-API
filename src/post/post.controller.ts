import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post-dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { TUserSub } from 'src/common/types/user.types';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth('ADMIN')
  @Delete(':id')
  async adminRemove(@Authorized() user: TUserSub, @Param('id') id: string) {
    return this.postService.adminRemove(user, id);
  }

  @Auth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Authorized() user: TUserSub, @Body() dto: CreatePostDto) {
    return this.postService.create(user, dto);
  }

  @Auth()
  @Get('/user')
  async findUserPosts(
    @Authorized() user: TUserSub,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.postService.findUserPosts(user, pageNum, limitNum);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.postService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  async update(
    @Authorized() user: TUserSub,
    @Body() dto: UpdatePostDto,
    @Param('id') id: string,
  ) {
    return this.postService.update(user, id, dto);
  }

  @Auth()
  @Delete(':id')
  async remove(@Authorized() user: TUserSub, @Param('id') id: string) {
    return this.postService.remove(user, id);
  }
}
