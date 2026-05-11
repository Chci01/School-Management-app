import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('academic-years')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  create(@Request() req, @Body() data: any) {
    const schoolId = req.user.schoolId || data.schoolId;
    return this.academicYearsService.create(schoolId, data);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findAll(@Request() req) {
    return this.academicYearsService.findAll(req.user.schoolId);
  }

  @Get('active')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.ELEVE, Role.PARENT, Role.SUPER_ADMIN)
  findActive(@Request() req, @Query('schoolId') schoolId?: string) {
    const finalSchoolId = req.user.schoolId || schoolId;
    return this.academicYearsService.findActive(finalSchoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.academicYearsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.academicYearsService.update(id, data);
  }

  @Post(':id') // Fallback POST for update
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  updatePost(@Param('id') id: string, @Body() data: any) {
    return this.academicYearsService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.academicYearsService.remove(id);
  }
}
