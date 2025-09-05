import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies['accessToken'];
    if (!cookie) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    try {
      const payload = jwt.verify(cookie, process.env.JWT_SECRET as string) as {
        id: string;
        role: Role;
      };

      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Токен не валиден');
    }
  }
}
