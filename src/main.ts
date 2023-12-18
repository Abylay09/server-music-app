import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://a9fa-2-132-101-152.ngrok-free.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    allowedHeaders: [
      'accept',
      'authorization',
      'content-type',
      'user-agent',
      'x-csrftoken',
      'x-requested-with',
      'ngrok-skip-browser-warning',
    ],
  });
  await app.listen(3001);
}
bootstrap();
