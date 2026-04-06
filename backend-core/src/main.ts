import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Activer CORS pour les différents frontends
  app.enableCors();
  // Activer la validation globale via class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Retire les attributs non inclus dans le DTO
    forbidNonWhitelisted: true, // Lève une erreur si des attributs interdits sont présents
    transform: true,       // Transforme automatiquements les payloads vers le type attendu
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
