import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifyCallback } from "passport-jwt";
import { SYSTEM_KEY } from "src/common/constants/enums";
import { SessionUserModel } from "src/common/models/session-user.model";
import { AuthService } from "../auth.service";
import { CustomExceptionFilter } from "src/configs/filters/custom-exception.filter";
import { Request } from "express";
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, SYSTEM_KEY.AccessTokenPassportKey) {

    constructor(private readonly configService: ConfigService,
        private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET', ''),
            passReqToCallback: true // cho phep goi Request trong validate
        });
    }

    async validate(req: Request, payload: SessionUserModel) {
        // This method is called by Passport after the JWT is verified.
        // send auth-service to check sid
        if (!payload || !payload.sid) throw new CustomExceptionFilter('NOT_FOUND_SESSION', 'The session is not exsited')
        const checkBls = await this.authService.sidInBlacklist(payload.sid)
        if (checkBls) throw new CustomExceptionFilter('BLACK_LIST_SESSION', 'This session is in black list')
        const checkPer = await this.authService.deniedPermission({ role: payload.role, url: req.url })
        if (checkPer) throw new CustomExceptionFilter('DENIED_PERMISSION', 'User khong du quyen truy cap')
        return payload;
    }
}
