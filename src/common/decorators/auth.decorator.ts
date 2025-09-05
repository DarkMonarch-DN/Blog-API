import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

export function Auth(...roles: Role[]) {
  if (roles.length > 1) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }
  return applyDecorators(UseGuards(AuthGuard));
}
