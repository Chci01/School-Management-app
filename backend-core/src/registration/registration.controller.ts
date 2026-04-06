import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('signup')
  async signup(@Body() signupDto: any) {
    return this.registrationService.registerSchool(signupDto);
  }

  @Post('activate')
  async activate(@Body() activateDto: { licenseKey: string }) {
    if (!activateDto.licenseKey) {
      throw new BadRequestException('Clé de licence manquante.');
    }
    return this.registrationService.activateLicense(activateDto.licenseKey);
  }
}
