import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSuccessResponseApiModel } from '../models/global-response-api.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalResponseInterceptor.name);
  private readonly jwtService = new JwtService();

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GlobalSuccessResponseApiModel> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const token = request?.cookies && request.cookies['accessToken'];
    if (token) {
      request.user = this.jwtService.decode(token);
    }
    return next.handle().pipe(
      map((data) => {
        const responseBody: GlobalSuccessResponseApiModel = {
          statusCode: statusCode,
          timestamp: new Date().toISOString(),
          path: `${request.method} ${request.url}`,
          message: data?.message ?? 'Operation successful.',
          data: data?.message ? undefined : (data?.data ?? data),
        };

        if (data?.metadata) {
          responseBody.metadata = data.metadata;
        }
        this.logger.log(
          JSON.stringify({
            message: `Request Success(${statusCode})`,
            statusCode: statusCode,
            path: `${request.method} ${request.url}`,
            timestamp: responseBody.timestamp,
            resource: GlobalResponseInterceptor.name,
          }),
        );

        return responseBody;
      }),
    );
  }
}
