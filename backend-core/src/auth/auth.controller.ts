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
}
