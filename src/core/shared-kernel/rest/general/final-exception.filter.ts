import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import { ApiResponse } from '../dto/api-response.dto';

@Catch()
export class FinalExceptionFilter implements ExceptionFilter {
  private readonly isProd = process.env.NODE_ENV === 'production';

  public catch(originException: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpException = FinalExceptionFilter.parseError(originException);

    if (httpException.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(JSON.stringify(originException.stack));

      // const request = ctx.getRequest();
      // const userData = request.user ? { id: request.user.id } : null;
      // TODO: send to Sentry exception
    }

    const exceptionResponse = httpException.getResponse() || {};
    const errorMessage =
      typeof exceptionResponse === 'object' &&
      exceptionResponse['message'] &&
      Array.isArray(exceptionResponse['message']) &&
      exceptionResponse['message'].length > 0
        ? exceptionResponse['message'][0]
        : httpException.message;
    httpException.message = errorMessage;

    if (!this.isProd || (this.isProd && httpException.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR)) {
      response.status(httpException.getStatus()).json(ApiResponse.error(httpException));
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error('Something went wrong'));
    }
  }

  private static parseError(exception: Error): HttpException {
    return exception instanceof HttpException ? exception : new InternalServerErrorException(exception.message);
  }
}
