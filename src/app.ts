import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalResponseInterceptor } from './interceptor/global-response.interceptor';
import { GlobalExceptionFilter } from './exception/global-exception.filter';
import { SetupSwaggerDocumentation } from './swagger';

const NestAppOptions: NestApplicationOptions = {
  bodyParser: true,
  rawBody: true,
  logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
};

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, NestAppOptions);

  // INFO: Global path to access apis
  app.setGlobalPrefix('api');

  //Helmet
  app.use(helmet());

  // enabling CORS
  app.enableCors();

  // INFO: Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // INFO: Global Interceptors
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  // INFO: Global Filters
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  // INFO: Swagger Documentation
  SetupSwaggerDocumentation(app);

  // INFO: Server PORT
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // listen port should be at the end
  await app.listen(port);
};
