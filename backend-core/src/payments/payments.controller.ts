import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE)
  create(@Body() createPaymentDto: any, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE)
  findAll(@Request() req) {
    return this.paymentsService.findAll(req.user);
  }

  @Get('student/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_ECOLE, Role.PARENT, Role.ELEVE)
  findByStudent(@Param('id') studentId: string, @Request() req) {
    return this.paymentsService.findByStudent(studentId, req.user);
  }
}
