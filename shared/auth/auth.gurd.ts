import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request as Req } from 'express';
import { ErrorMessage } from 'shared/error.constant';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the JWT token from the request header.
    const request: Req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token || token === 'null') {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED_ACCESS);
    }

    // Check if token is in the blocklist
    const isBlocked = await this.userService.isTokenBlocked(token);
    if (isBlocked) {
      throw new UnauthorizedException(ErrorMessage.REVOKE_TOKEN);
    }

    let payload;
    try {
      // Verify the JWT token and extract payload.
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new HttpException(ErrorMessage.EXPIRED_TOKEN, HttpStatus.GONE);
    }

    if (!payload) {
      throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
    }

    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(request: Req): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
