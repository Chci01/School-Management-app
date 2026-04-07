import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('subjects')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  create(@Request() req, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(req.user.schoolId, createSubjectDto);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  findAll(@Request() req) {
    return this.subjectsService.findAll(req.user.schoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  findOne(@Request() req, @Param('id') id: string) {
    return this.subjectsService.findOne(req.user.schoolId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE)
  update(@Request() req, @Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(req.user.schoolId, id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE)
  remove(@Request() req, @Param('id') id: string) {
    return this.subjectsService.remove(req.user.schoolId, id);
  }
}
