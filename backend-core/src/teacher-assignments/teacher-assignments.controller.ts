import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TeacherAssignmentsService } from './teacher-assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('teacher-assignments')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class TeacherAssignmentsController {
  constructor(private readonly assignmentsService: TeacherAssignmentsService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  assign(@Body() data: any) {
    return this.assignmentsService.assign(data);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  findAll(@Request() req) {
    return this.assignmentsService.findAll(req.user.schoolId);
  }

  @Get('teacher/:id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.SUPER_ADMIN)
  findByTeacher(@Param('id') id: string) {
    return this.assignmentsService.findByTeacher(id);
  }

  @Get('class/:id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  findByClass(@Param('id') id: string) {
    return this.assignmentsService.findByClass(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
