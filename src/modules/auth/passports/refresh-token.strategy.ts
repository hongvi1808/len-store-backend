import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SYSTEM_KEY } from "../../../common/constants/enums";
import { SessionUserModel } from "../../../common/models/session-user.model";
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, SYSTEM_KEY.RefreshTokenPassportKey) {

    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => req.cookies?.[SYSTEM_KEY.RefreshTokenCookieKey],
            ]),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', ''),

        });
    }

    validate(payload: SessionUserModel): unknown {
        // This method is called by Passport after the JWT is verified.
        if (!payload || !payload.sid) {
            throw new Error('Invalid token payload');
        }
        return payload;
    }
}
