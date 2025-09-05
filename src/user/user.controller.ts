import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { TUserSub } from 'src/common/types/user.types';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth('ADMIN')
  @Get()
  async findAll(@Authorized() user: TUserSub): Promise<User[]> {
    return this.userService.findAll(user);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async remove(
    @Authorized() user: TUserSub,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.remove(user, id);
  }

  @Auth()
  @Get('/profile')
  async getProfile(
    @Authorized() user: TUserSub,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.getProfile(user);
  }
  @Auth()
  @Patch('/edit-profile')
  async editProfile(@Authorized() user: TUserSub, @Body() dto: UpdateUserDto) {
    return this.userService.editProfile(user, dto);
  }
}
