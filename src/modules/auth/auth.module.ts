import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './passports/access-token.strategy';
import { RefreshTokenStrategy } from './passports/refresh-token.strategy';
import { GoogleStrategy } from './passports/google.strategy';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LenRedisModule } from '../../common/redis/redis.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PermissionModule } from '../permission/permission.module';
import { GoogleAuthService } from './google.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    }),
    LenRedisModule, UserModule, PermissionModule, ConfigModule,
  ],
  controllers: [AuthController,],
  providers: [ AuthService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, GoogleAuthService],
  exports: [AuthService]
})
export class AuthModule { }
