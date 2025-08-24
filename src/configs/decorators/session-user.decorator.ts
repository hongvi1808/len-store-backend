import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionUserModel } from 'src/common/models/session-user.model';

export const SessionUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: SessionUserModel = request.user;

        if (data) return user ? user[data] : null;
        return user;
    }
)
