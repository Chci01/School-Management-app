import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { LicenseGuard } from '../auth/license.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('bulletin/:studentId')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  generateBulletin(
    @Request() req,
    @Param('studentId') studentId: string,
    @Query('term') term: number,
    @Query('academicYearId') academicYearId: string
  ) {
    const schoolId = req.user.schoolId;
    return this.reportsService.generateBulletin(schoolId, studentId, term, academicYearId);
  }

  @Patch('publish')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  publishTerm(
    @Request() req,
    @Body('academicYearId') academicYearId: string,
    @Body('term') term: number,
    @Body('isPublished') isPublished: boolean,
    @Body('classId') classId?: string,
  ) {
    const schoolId = req.user.schoolId;
    return this.reportsService.publishTerm(schoolId, academicYearId, classId || null, term, isPublished);
  }
}
