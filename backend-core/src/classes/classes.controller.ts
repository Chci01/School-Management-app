import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('classes')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  create(@Request() req, @Body() data: any) {
    const schoolId = req.user.schoolId || data.schoolId;
    return this.classesService.create(schoolId, data);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findAll(@Request() req, @Query('schoolId') querySchoolId?: string) {
    const schoolId = req.user.schoolId || querySchoolId;
    if (!schoolId) return [];
    return this.classesService.findAll(schoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.classesService.update(id, data);
  }

  @Post(':id') // Fallback POST for update
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  updatePost(@Param('id') id: string, @Body() data: any) {
    return this.classesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
