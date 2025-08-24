import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { headers } = req;
    const token: string = headers['authorization']

    if (token && !token.startsWith('Bearer'))
      throw new UnauthorizedException('Invaliding Authorization header', 'AuthMiddleware');


    next();
  }
}
