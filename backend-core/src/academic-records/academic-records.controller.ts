import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AcademicRecordsService } from './academic-records.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';
import { LicenseGuard } from '../auth/license.guard';

@Controller('academic-records')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class AcademicRecordsController {
  constructor(private readonly academicRecordsService: AcademicRecordsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  createOrUpdate(@Body() data: any, @Request() req) {
    return this.academicRecordsService.createOrUpdate(data, req.user);
  }

  @Get('student/:id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER, Role.PARENT, Role.STUDENT)
  findByStudent(@Param('id') studentId: string, @Request() req) {
    // Parent/Student authorization happens inside service or via extra guards in production.
    return this.academicRecordsService.findByStudent(studentId, req.user);
  }

  @Get('class/:classId/year/:yearId')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
  findByClassAndYear(
    @Param('classId') classId: string, 
    @Param('yearId') yearId: string, 
    @Request() req
  ) {
    return this.academicRecordsService.findByClassAndYear(classId, yearId, req.user);
  }
}
