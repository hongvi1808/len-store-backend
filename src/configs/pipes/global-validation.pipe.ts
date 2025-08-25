import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from '../filters/custom-exception.filter';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
       exceptionFactory: (errors) => {
        const messages = errors.map(
          (err: any) =>
            `${err.property} - ${Object.values(err?.constraints).join(', ')}`
        );
        return new CustomExceptionFilter('INVALID_VALIDATION', messages.join(' '), null, 400);
      },
    })
  }
}
