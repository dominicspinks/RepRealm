import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthResponse } from './dtos/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    // Convert Prisma user object to UserEntity
    private mapUserToEntity(user: any): UserEntity {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName ?? undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        return this.mapUserToEntity(user);
    }

    async login(dto: LoginUserDto): Promise<AuthResponse> {
        const user = await this.validateUser(dto.email, dto.password);
        const payload = { sub: user.id, email: user.email };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '365d' });

        // Hash the refresh token before storing it
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.HASH_SECRET ?? "")
            .update(refreshToken)
            .digest('hex');

        // Store the hashed refresh token in the database
        await this.prisma.userSession.upsert({
            where: { userId: user.id },
            update: { refreshToken: hashedRefreshToken, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
            create: { userId: user.id, refreshToken: hashedRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });

        return { accessToken, refreshToken, userId: user.id };
    }

    async createUser(dto: CreateUserDto): Promise<AuthResponse> {
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 12);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    fullName: dto.fullName,
                },
            });

            return this.login({ email: dto.email, password: dto.password });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email is already in use');
            }
            throw error;
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.HASH_SECRET ?? "")
            .update(refreshToken)
            .digest('hex');

        const session = await this.prisma.userSession.findFirst({
            where: { refreshToken: hashedRefreshToken },
            include: { user: true },
        });

        if (!session || !session.expiresAt || new Date() > session.expiresAt) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Generate a new access token
        const payload = { sub: session.user.id, email: session.user.email };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

        return { accessToken, refreshToken, userId: session.user.id };
    }
}
