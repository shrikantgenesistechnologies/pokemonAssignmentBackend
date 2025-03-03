import { SwaggerModule } from '@nestjs/swagger';
import {
  SwaggerCustomOption,
  SwaggerDocumentConfig,
  SwaggerDocumentOption,
} from './swagger-document';
import { INestApplication } from '@nestjs/common';
import { swaggerDocumentModifications, writeJsonToFile } from './swagger-oas';

export const SetupSwaggerDocumentation = (app: INestApplication) => {
  // INFO: Prepared Swagger Documentation
  const document = SwaggerModule.createDocument(
    app,
    {
      ...SwaggerDocumentConfig(),
      openapi: '3.1.0',
    },
    SwaggerDocumentOption,
  );
  // INFO: Write Swagger Documentation
  writeJsonToFile(document);
  const modifiedDocument = swaggerDocumentModifications(document);
  // INFO: Allow Accessiblity to Swagger Documentation
  SwaggerModule.setup(
    process.env.SWAGGER_SERVER_API,
    app,
    modifiedDocument,
    SwaggerCustomOption,
  );
};
