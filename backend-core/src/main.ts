import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activate Helmet middleware to secure HTTP headers
  app.use(helmet());
  
  app.enableCors({
    origin: true, // Allows all origins dynamically
    credentials: true,
  });

  // Activate global ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
