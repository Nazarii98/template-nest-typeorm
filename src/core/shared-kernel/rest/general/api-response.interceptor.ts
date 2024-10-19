import { CallHandler, ExecutionContext, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export default class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | StreamableFile> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | StreamableFile> | Promise<Observable<ApiResponse<T> | StreamableFile>> {
    return next.handle().pipe(map((data) => ApiResponse.ok(data)));
  }
}
