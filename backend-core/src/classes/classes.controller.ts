import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('classes')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN_ECOLE)
  create(@Request() req, @Body() createClassDto: CreateClassDto) {
    return this.classesService.create(req.user.schoolId, createClassDto);
  }

  @Get()
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  findAll(@Request() req, @Query('academicYearId') academicYearId?: string) {
    return this.classesService.findAll(req.user.schoolId, academicYearId);
  }

  @Get(':id')
  @Roles(Role.ADMIN_ECOLE, Role.ENSEIGNANT)
  findOne(@Request() req, @Param('id') id: string) {
    return this.classesService.findOne(req.user.schoolId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_ECOLE)
  update(@Request() req, @Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(req.user.schoolId, id, updateClassDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_ECOLE)
  remove(@Request() req, @Param('id') id: string) {
    return this.classesService.remove(req.user.schoolId, id);
  }
}
