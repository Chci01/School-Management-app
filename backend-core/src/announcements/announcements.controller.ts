import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';
import { LicenseGuard } from '../auth/license.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  create(@Body() createDto: any, @Request() req) {
    return this.announcementsService.create(createDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.announcementsService.findAll(req.user);
  }
}
