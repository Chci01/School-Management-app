import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('grades')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  create(@Body() data: any) {
    return this.gradesService.create(data);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.ELEVE, Role.PARENT, Role.SUPER_ADMIN)
  findByStudent(@Param('studentId') studentId: string, @Query('academicYearId') academicYearId: string) {
    return this.gradesService.findByStudent(studentId, academicYearId);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findByClass(
    @Param('classId') classId: string, 
    @Query('subjectId') subjectId: string, 
    @Query('academicYearId') academicYearId: string,
    @Query('term') term: number
  ) {
    return this.gradesService.findByClass(classId, subjectId, academicYearId, term);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.gradesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.gradesService.remove(id);
  }
}
