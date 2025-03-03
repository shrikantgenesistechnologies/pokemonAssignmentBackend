import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? ((exceptionResponse as any).message ?? exception.message)
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = {
      message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    this.logger.error(
      JSON.stringify({
        message: `Request Failed(${httpStatus}): ${message} | Path: ${request.method} ${request.url}`,
        statusCode: httpStatus,
        timestamp: responseBody.timestamp,
        resource: GlobalExceptionFilter.name,
      }),
    );

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
