import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('subjects')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  create(@Request() req, @Body() data: any) {
    return this.subjectsService.create(req.user.schoolId, data);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findAll(@Request() req) {
    return this.subjectsService.findAll(req.user.schoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.subjectsService.update(id, data);
  }

  @Post(':id') // Fallback
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  updatePost(@Param('id') id: string, @Body() data: any) {
    return this.subjectsService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}
