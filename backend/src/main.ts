import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the Next.js frontend to call the API.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  });

  // Validate and transform all incoming request payloads.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // URI-based versioning -> routes are served under /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger / OpenAPI documentation available at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('A simple API to create and manage tasks.')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api/v1`);
  console.log(`Swagger docs on http://localhost:${port}/api/docs`);
}
bootstrap();
