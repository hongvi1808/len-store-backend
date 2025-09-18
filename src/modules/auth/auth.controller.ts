import { Controller, Get, Post, Body, UseInterceptors, UseGuards, Res, Inject, OnModuleInit, Param, Req } from '@nestjs/common';
import { NoGlobalAuth } from '../../configs/decorators/no-auth.decorator';
import { SetCookieInterceptor } from '../../configs/interceptions/set-cookie.interceptor';
import { RefreshTokenAuthGuard } from '../../configs/guards/refresh-token-auth.guard';
import { SessionUser } from '../../configs/decorators/session-user.decorator';
import { SessionUserModel } from '../../common/models/session-user.model';
import { Response } from 'express';
import { GoogleAuthGuard } from '../../configs/guards/google-auth.guard';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SYSTEM_KEY } from '../../common/constants/enums';
import { GoogleAuthDto, LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { AuthResponse } from './model/auth.response';
import { UserDataCallback } from './model/data-gg-callback.response';
import { GoogleAuthService } from './google.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly ggService: GoogleAuthService,
  ) { }

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
    res.clearCookie(SYSTEM_KEY.AccessTokenCookieKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Adjust as necessary
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.clearCookie(SYSTEM_KEY.RoleCookieKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Adjust as necessary
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return true;
  }

  @NoGlobalAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() { }

  @NoGlobalAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@SessionUser() user: UserDataCallback) {
    return this.authService.googleCallback(user)
  }

  @NoGlobalAuth()
  // @UseInterceptors(SetCookieInterceptor)
  @Post('google/verify')
  async googleVerify(@Body() credential: string) {
    const user =  await this.ggService.verifyGoogleLogin(credential)
    console.log(user)
    // return this.authService.googleCallback(user)
  }

}
