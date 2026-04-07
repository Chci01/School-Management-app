import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('health')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  create(@Body() createHealthDto: any, @Request() req) {
    return this.healthService.create(createHealthDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.healthService.findAll(req.user);
  }
}
