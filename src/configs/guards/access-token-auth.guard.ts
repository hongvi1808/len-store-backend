import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NO_GLOBAL_AUTH } from '../decorators/no-auth.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SYSTEM_KEY } from 'src/common/constants/enums';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(SYSTEM_KEY.AccessTokenPassportKey) {
 constructor(private readonly reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(NO_GLOBAL_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (isPublic) return true;
        
        return super.canActivate(context);
    }
}
