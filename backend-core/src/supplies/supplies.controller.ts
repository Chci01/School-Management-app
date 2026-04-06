import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('supplies')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  create(@Body() createSupplyDto: CreateSupplyDto, @Request() req) {
    return this.suppliesService.create(createSupplyDto, req.user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  findAll(@Request() req) {
    return this.suppliesService.findAllBySchool(req.user);
  }

  @Get('class/:id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  findByClass(@Param('id') classId: string, @Request() req) {
    return this.suppliesService.findByClass(classId, req.user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.suppliesService.remove(id, req.user);
  }
}
