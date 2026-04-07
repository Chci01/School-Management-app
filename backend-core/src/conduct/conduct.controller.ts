import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ConductService } from './conduct.service';
import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('conduct')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class ConductController {
  constructor(private readonly conductService: ConductService) {}

  @Post('teacher')
  @Roles(Role.ENSEIGNANT)
  submitTeacherConduct(@Body() createConductDto: CreateConductDto, @Request() req) {
    return this.conductService.submitTeacherConduct(createConductDto, req.user);
  }

  @Post('admin/calculate')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE)
  calculateGlobalConduct(@Body() dto: CalculateConductDto, @Request() req) {
    return this.conductService.calculateGlobalConduct(dto, req.user);
  }

  @Get('global/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE, Role.ENSEIGNANT, Role.ELEVE, Role.PARENT)
  getGlobalConduct(
    @Param('studentId') studentId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.conductService.getGlobalConduct(studentId, parseInt(month), parseInt(year));
  }
}
