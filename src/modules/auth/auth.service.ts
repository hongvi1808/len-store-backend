import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from "uuidv7";
import { SYSTEM_KEY } from '../../common/constants/enums';
import { SessionUserModel } from '../../common/models/session-user.model';
import { RedisService } from '../../common/redis/redis.service';
import { CustomExceptionFilter } from '../../configs/filters/custom-exception.filter';
import { AuthResponse } from './model/auth.response';
import { UserService } from '../user/user.service';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { UserDataCallback } from './model/data-gg-callback.response';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class AuthService {
  constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly permissionService: PermissionService,
        //  private readonly redisClient: RedisService,
    ) { }
    async register(body: RegisterAuthDto): Promise<AuthResponse> {
        // if (!body.phoneNumber && !body.email) 
        //     throw new CustomExceptionFilter('REQUIRED_PHONE_OR_EMAIL', 'Phone or email is required')
        // const userFound = await this.userService.findByUsername(body.phoneNumber || body.email || '' )
        const userFound = await this.userService.findByUsername(body.phoneNumber )
        if (userFound) throw new CustomExceptionFilter('EXISTED_USER', 'This user existed')
        const createUser = await this.userService.create({
            fullName: body.fullName,
            phoneNumber: body.phoneNumber,
            role: UserRole.Customer,
        }, body.password);

        const jwtObject: SessionUserModel = {
            sid: uuidv7(),
            userId: createUser.id,
            role:  createUser.role,
            username: createUser.username
        }
        const { accessToken, expiredAt } = await this.generateAccessToken(jwtObject);
        const refreshToken = await this.generateRefreshToken(jwtObject);

        return { accessToken, refreshToken, expiredAt, userId: createUser.id, role: createUser.role  }
    }

    async logIn(body: LoginAuthDto): Promise<AuthResponse> {
        if (!body.username && !body.phoneNumber)  throw new CustomExceptionFilter('REQUIRE_FIELD', 'username or phoneNumber is require')
        const userFound = await this.userService.findByUsername(body.phoneNumber || body.username)
        if (!userFound) throw new CustomExceptionFilter('NOT_FOUND_USER', 'This user is not existed')
            const validPass = await bcrypt.compare(
            body.password,
            userFound.hash,
        );
        if (!validPass) throw new CustomExceptionFilter('WRONG_PASSWORD', 'The password is wrong')

        const jwtObject: SessionUserModel = {
            sid: uuidv7(),
            userId: userFound.id,
            role: userFound.role || '',
            username: userFound.username
        }
        const { accessToken, expiredAt } = await this.generateAccessToken(jwtObject);
        const refreshToken = await this.generateRefreshToken(jwtObject);

        return { accessToken, refreshToken, expiredAt, userId: userFound.id, role: userFound.role }
    }

    async refreshToken(sUser: SessionUserModel): Promise<AuthResponse> {
        const payload: SessionUserModel = {role: sUser.role, userId: sUser.userId, username: sUser.username, sid: uuidv7()}
        const { accessToken, expiredAt } = await this.generateAccessToken(payload);
        return { accessToken, expiredAt, userId: sUser.userId, role: sUser.role }
    }
    async logout(sUser: SessionUserModel) {
    await this.addSidToBlacklist(sUser.sid)
  }

  async addSidToBlacklist(sid: string): Promise<any> {
    // return this.redisClient.set(`${SYSTEM_KEY.PrefixKeySessionBlackList}_${sid}`, 1,)
    return 
  }
    async sidInBlacklist(sid: string): Promise<string | null> {
    // return this.redisClient.get(`${SYSTEM_KEY.PrefixKeySessionBlackList}_${sid}`);
    return null;

  }
    async deniedPermission(request: {role: UserRole, url: string}): Promise<boolean> {
        if ( request.role === UserRole.Admin) return false
        // const result = await this.permissionService.getPersByRoledAndUrl(request.role, request.url);

        // if (result) false
        // return true
        return false
    }
    async googleCallback(body: UserDataCallback): Promise<AuthResponse> {
        let user: any;
        user = await this.userService.findByUsername(body.email)
        if (!user) {
            user = await this.userService.create({
                fullName: body.fullName,
                phoneNumber: '',
                email: body.email,
                birthDate: 0,
                role: UserRole.Customer,
            },);

        }
        const jwtObject: SessionUserModel = {
            sid: uuidv7(),
            userId: user.id,
            role: user.role || '',
            username: user.username
        }

        const { accessToken, expiredAt } = await this.generateAccessToken(jwtObject);
        const refreshToken = await this.generateRefreshToken(jwtObject);

        return { accessToken, refreshToken, expiredAt, userId: user.id, role: user.role }
    }
     private async generateAccessToken(payload: SessionUserModel): Promise<{ accessToken: string, expiredAt: number }> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN')
        });
        const expireAt = await this.jwtService.decode(accessToken) as { exp: number };
        return { accessToken, expiredAt: expireAt.exp * 1000 }; // Convert to milliseconds
    }
    /**
     * Generates a refresh token for the user.
     */
    private async generateRefreshToken(payload: SessionUserModel): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')
        });
    }
}
