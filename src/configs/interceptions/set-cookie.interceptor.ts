import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { SYSTEM_KEY } from '../../common/constants/enums';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            tap((data) => {
                const refreshToken = data?.refreshToken;
                const accessToken = data?.accessToken;
                const role = data?.role;
                if (refreshToken) {
                    response.cookie(SYSTEM_KEY.RefreshTokenCookieKey, refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                        sameSite: 'Strict', // Adjust as necessary
                        maxAge: 2592000000, // 30 days
                    });
                }
                if (accessToken) {
                    response.cookie(SYSTEM_KEY.AccessTokenCookieKey, accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                        sameSite: 'Strict', // Adjust as necessary
                        maxAge: 2592000000, // 30 days
                    });
                }
                if (role) {
                    response.cookie(SYSTEM_KEY.RoleCookieKey, role, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                        sameSite: 'Strict', // Adjust as necessary
                        maxAge: 2592000000, // 30 days
                    });
                }
            })
        )
    }
}
