import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

export const SwaggerCustomOption: SwaggerCustomOptions = {
  swaggerUrl: process.env.SWAGGER_SERVER_URL + '/api',
  customSiteTitle: 'Pokemon',
  swaggerOptions: {
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    schemaSorter: 'alpha',
  },
};

export const SwaggerDocumentOption: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  deepScanRoutes: true,
  ignoreGlobalPrefix: false,
};

export const SwaggerDocumentConfig = () => {
  return new DocumentBuilder()
    .setTitle(process.env.SWAGGER_SERVER_TITLE)
    .setDescription(process.env.SWAGGER_SERVER_DESCRIPTION)
    .setVersion(process.env.SWAGGER_SERVER_VERSION)
    .addServer(process.env.SWAGGER_SERVER_URL, process.env.SWAGGER_SERVER_NAME)
    .build();
};
