import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, protocol, headers, host } = req;
    const protocolReq = headers['x-forwarded-proto'] || protocol;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode, statusMessage } = res;
      if (statusCode >= 400)
        Logger.error(`[${protocolReq}://${host}] ${method} ${originalUrl} - ${statusCode} ${statusMessage} +${duration}ms `, 'LoggerMiddleware');
      else
        Logger.log(`[${protocolReq}://${host}] ${method} ${originalUrl} - ${statusCode} ${statusMessage} ${duration}ms`, 'LoggerMiddleware');
    });

    res.on('error', (err: any) => {
      Logger.error(
        `Error in response: ${err.message}`,
        err.stack,
        'LoggerMiddleware',
      );
    });

    next();
  }
}
