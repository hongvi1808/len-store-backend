import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SYSTEM_KEY } from 'src/common/constants/enums';
import { CustomExceptionFilter } from '../filters/custom-exception.filter';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(SYSTEM_KEY.RefreshTokenPassportKey) {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext,): any {
        // Handle the user object returned by strategy
        if (err || !user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

