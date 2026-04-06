import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('academic-years')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Post()
  @Roles(Role.SCHOOL_ADMIN)
  create(@Request() req, @Body() createAcademicYearDto: CreateAcademicYearDto) {
    return this.academicYearsService.create(req.user.schoolId, createAcademicYearDto);
  }

  @Get()
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER)
  findAll(@Request() req) {
    return this.academicYearsService.findAll(req.user.schoolId);
  }

  @Get('active')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  findActive(@Request() req) {
    return this.academicYearsService.findActive(req.user.schoolId);
  }

  @Get(':id')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER)
  findOne(@Request() req, @Param('id') id: string) {
    return this.academicYearsService.findOne(req.user.schoolId, id);
  }

  @Patch(':id')
  @Roles(Role.SCHOOL_ADMIN)
  update(@Request() req, @Param('id') id: string, @Body() updateAcademicYearDto: UpdateAcademicYearDto) {
    return this.academicYearsService.update(req.user.schoolId, id, updateAcademicYearDto);
  }

  @Delete(':id')
  @Roles(Role.SCHOOL_ADMIN)
  remove(@Request() req, @Param('id') id: string) {
    return this.academicYearsService.remove(req.user.schoolId, id);
  }
}
