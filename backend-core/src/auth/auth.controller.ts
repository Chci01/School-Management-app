import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    // We expect { matricule: "...", password: "...", schoolId: "uuid..." }
    const { schoolId, matricule, password } = body;
    
    // Validate credentials
    const finalSchoolId = (schoolId === '' || !schoolId) ? null : schoolId;
    const user = await this.authService.validateUser(finalSchoolId, matricule, password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('setup-admin')
  async setupAdmin() {
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
        return { success: true, message: 'Admin updated successfully' };
      }
      return { success: false, message: 'No admin found' };
    } finally {
      await prismaClient.$disconnect();
    }
  }
}
