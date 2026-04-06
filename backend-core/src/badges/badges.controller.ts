import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('badges')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('template')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  getTemplate(@Request() req) {
    return this.badgesService.getTemplate(req.user);
  }

  @Patch('template')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  updateTemplate(@Body() updateDto: any, @Request() req) {
    return this.badgesService.updateTemplate(updateDto, req.user);
  }

  @Get('generate/:userId')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  generateBadgeForUser(@Param('userId') targetUserId: string, @Request() req) {
    return this.badgesService.generateBadgeForUser(targetUserId, req.user);
  }
}
