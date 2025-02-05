import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }

        const gqlContext = GqlExecutionContext.create(context);
        const request = gqlContext.getContext().req;
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid authorization format');
        }

        try {
            const secret = this.configService.get<string>('JWT_SECRET');
            const decoded = this.jwtService.verify(token, { secret });
            request.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}