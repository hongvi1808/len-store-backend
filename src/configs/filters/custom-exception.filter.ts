import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { ResErrorModel } from 'src/common/models/res-error.model';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    constructor(private readonly code?: string, 
        private readonly message?: string, private readonly data?: any,
         private status: number = HttpStatus.NOT_ACCEPTABLE) { 
    }
    catch(exception: CustomExceptionFilter, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse()
        
        Logger.error(
            `Message: ${exception.message}`,
            exception,
            'CustomExceptionFilter',
        );

        const errorResponse: ResErrorModel = {
            success: false,
            code: exception.code || 'ERROR',
            statusCode: exception.status,
            message: exception.message || 'Error from server',
            error: 'CustomExceptionFilter',
            data: exception.data || null,
        }
        response
            .status(HttpStatus.NOT_ACCEPTABLE)
            .json(errorResponse);
    }
}
