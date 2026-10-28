import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Skill Swap API')
    .setDescription('API for the Skill Swap application')
    .setVersion('1.0.0')
    .addBearerAuth() // JWT Bearer
    .addBasicAuth() // Basic Auth
    .addCookieAuth('connect.sid') // Cookie Auth
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger is available on http://localhost:${port}/api/docs`);
}
await bootstrap();
