import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as swStats from 'swagger-stats';

export function initApi(app: NestExpressApplication) {
  app.enableCors();
  app.setGlobalPrefix('api', { exclude: [{ path: 'health', method: RequestMethod.GET }] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

export function initDocs(app: NestExpressApplication) {
  const DOCS_UI_PATH = 'docs';
  const JSON_PATH = 'docs-json';

  const documentationBuilder = new DocumentBuilder();

  const options = documentationBuilder
    .addBearerAuth({ in: 'header', type: 'http' }, 'access_token')
    .addBearerAuth({ in: 'header', type: 'http' }, 'refresh_token')
    .addBasicAuth({ in: 'header', type: 'http' }, 'admin')
    .setDescription('Template API documentation')
    .setTitle('Template API')
    .setVersion(process.env.VERSION || '1.0.0')
    .setExternalDoc('Postman Collection', `/${JSON_PATH}`)
    .build();

  const swaggerDocumentation = SwaggerModule.createDocument(app, options);

  app.use(
    swStats.getMiddleware({
      uriPath: '/docs/stats',
      swaggerSpec: swaggerDocumentation,
      authentication: process.env.DOCS_USER,
      onAuthenticate: function (req, username, password) {
        // simple check for username and password
        if (process.env.DOCS_USER) {
          return username === process.env.DOCS_USER && password === process.env.DOCS_PASSWORD;
        }
        return true;
      },
    }),
  );

  app.use(
    `/${DOCS_UI_PATH}`,
    basicAuth({
      users: {
        [process.env.DOCS_USER || 'developer']: process.env.DOCS_PASSWORD || '12345',
      },
      challenge: true,
    }),
  );

  SwaggerModule.setup(DOCS_UI_PATH, app, swaggerDocumentation, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
