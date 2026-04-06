import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { LicenseGuard } from '../auth/license.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN, Role.TEACHER)
  findAll(@Request() req, @Query('role') role?: string, @Query('schoolId') querySchoolId?: string) {
    const schoolId = req.user.schoolId;
    return this.usersService.findAll(schoolId, role, querySchoolId);
  }

  @Post()
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  create(@Request() req, @Body() createUserDto: any) {
    const schoolId = req.user.schoolId || createUserDto.schoolId;
    return this.usersService.create({ ...createUserDto, schoolId });
  }

  @Delete(':id')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  remove(@Request() req, @Param('id') id: string) {
    const schoolId = req.user.schoolId;
    return this.usersService.remove(schoolId, id);
  }
}
