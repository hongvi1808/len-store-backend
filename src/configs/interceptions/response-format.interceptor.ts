import {  CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import {  map, Observable } from 'rxjs';
import { ResSuccessModel } from 'src/common/models/res-success.model';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

      return next.handle().pipe(map((data) => {
        return new ResSuccessModel(data);
      }));
  }
}
