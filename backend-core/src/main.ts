import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activate Helmet middleware to secure HTTP headers
  app.use(helmet());
  
  // Configure CORS securely (support credentials and allow specified origins)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'https://school-management-app-6pkq.onrender.com'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Activate global ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // --- TEMPORARY DB SCRIPT TO ENSURE ADMIN DATA ON RENDER ---
  const prismaClient = new (require('@prisma/client').PrismaClient)();
  try {
    const bcrypt = require('bcrypt');
    const adminUser = await prismaClient.user.findFirst({
      where: { role: 'ADMIN_ECOLE' }
    });
    if (adminUser) {
      const hashedPassword = await bcrypt.hash('admin1234', 10);
      await prismaClient.user.update({
        where: { id: adminUser.id },
        data: { 
          email: 'admin@itc.com',
          password: hashedPassword 
        }
      });
      console.log('Successfully updated ADMIN_ECOLE email to admin@itc.com and password to admin1234 on Render DB.');
    } else {
      console.log('No ADMIN_ECOLE user found to update.');
    }
  } catch (e) {
    console.error('Error updating admin info:', e);
  } finally {
    await prismaClient.$disconnect();
  }
  // ----------------------------------------------------------

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
