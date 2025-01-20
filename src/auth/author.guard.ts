import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log(`User role: ${user.role}`); 

    if (user.role !== 'Author') {
      throw new UnauthorizedException('Only authors are allowed to access this resource');
    }

    return true; 
  }
}