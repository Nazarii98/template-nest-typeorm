import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from '../../../configuration/config';
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly serverConfig: ServerConfig;

  constructor(private configService: ConfigService) {
    this.serverConfig = this.configService.get<ServerConfig>('server');
  }

  catch(exception: any, host: ArgumentsHost) {
    const errorId = v4();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { requestId } = ctx.getRequest<Request & { requestId: string }>();

    let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: any = exception.response?.message || exception.message;
    const detail = exception?.detail;
    const errorName = exception.response?.error;

    if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      messages = detail || exception.message;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      messages = exception.message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && !this.allowExposeDebugErrorMessages()) {
      messages = 'Something went wrong! Maybe your account is not ready yet. Please, contact support';
    }

    if (Array.isArray(messages)) {
      messages = messages.flat();
    }

    response.status(status).send({
      error: errorName,
      code: status,
      key: exception?.response?.key,
      messages,
      errorId,
      requestId,
    });
  }

  private allowExposeDebugErrorMessages(): boolean {
    return this.serverConfig.environment === 'local' || this.serverConfig.environment === 'development';
  }
}
