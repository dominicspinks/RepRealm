import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from './public.decorator';
import { AuthResponse } from './dtos/auth-response.dto';

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Mutation(() => AuthResponse)
    async signUp(@Args('input') input: CreateUserDto): Promise<AuthResponse> {
        return await this.authService.createUser(input);
    }

    @Public()
    @Mutation(() => AuthResponse)
    async login(@Args('input') input: LoginUserDto): Promise<AuthResponse> {
        return await this.authService.login(input);
    }

    @Public()
    @Mutation(() => AuthResponse)
    async refreshToken(@Args('refreshToken') refreshToken: string): Promise<AuthResponse> {
        return this.authService.refreshToken(refreshToken);
    }

    @Query(() => String)
    async healthCheck(): Promise<string> {
        return "API is running";
    }
}