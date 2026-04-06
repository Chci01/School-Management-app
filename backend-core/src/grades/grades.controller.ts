import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('grades')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER)
  create(@Request() req, @Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(req.user.schoolId, createGradeDto);
  }

  @Get('student/:studentId')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  findAllByStudent(
    @Request() req, 
    @Param('studentId') studentId: string,
    @Query('academicYearId') academicYearId?: string
  ) {
    return this.gradesService.findAllByStudent(req.user.schoolId, studentId, academicYearId);
  }

  @Get('student/:studentId/average')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentAverage(
    @Request() req, 
    @Param('studentId') studentId: string,
    @Query('academicYearId') academicYearId: string
  ) {
    if (!academicYearId) throw new Error('academicYearId is required to calculate average');
    return this.gradesService.calculateStudentAverage(req.user.schoolId, studentId, academicYearId);
  }
}
