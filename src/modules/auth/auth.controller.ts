import { Controller, Get, Post, Body, UseInterceptors, UseGuards, Res, Inject, OnModuleInit, Param, Req } from '@nestjs/common';
import { NoGlobalAuth } from 'src/configs/decorators/no-auth.decorator';
import { SetCookieInterceptor } from 'src/configs/interceptions/set-cookie.interceptor';
import { RefreshTokenAuthGuard } from 'src/configs/guards/refresh-token-auth.guard';
import { SessionUser } from 'src/configs/decorators/session-user.decorator';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { Response } from 'express';
import { GoogleAuthGuard } from 'src/configs/guards/google-auth.guard';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SYSTEM_KEY } from 'src/common/constants/enums';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { AuthResponse } from './model/auth.response';
import { UserDataCallback } from './model/data-gg-callback.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @NoGlobalAuth()
  @UseInterceptors(SetCookieInterceptor)
  @Post('login')
  async login(@Body() body: LoginAuthDto): Promise<AuthResponse> {
    return this.authService.logIn(body)
  }

  @NoGlobalAuth()
  @UseInterceptors(SetCookieInterceptor)
  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body)
  }
  @NoGlobalAuth()
  @UseGuards(RefreshTokenAuthGuard)
  @UseInterceptors(SetCookieInterceptor)
  @Get('refresh')
  async refrehToken(@SessionUser() user: SessionUserModel) {
    return this.authService.refreshToken(user)
  }

  @Get('/logout')
    logout(@SessionUser() user: SessionUserModel, @Res({ passthrough: true }) res: Response) {
        const result = this.authService.logout(user);
        res.clearCookie(SYSTEM_KEY.RefreshTokenCookieKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Adjust as necessary
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return result;
    }
  
  @NoGlobalAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@SessionUser() user: SessionUserModel) { }

  @NoGlobalAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@SessionUser()  user: UserDataCallback) {
    return this.authService.googleCallback(user)
  }

}
