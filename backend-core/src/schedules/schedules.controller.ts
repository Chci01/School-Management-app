import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard, LicenseGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll(@Req() req, @Query('classId') classId?: string, @Query('teacherId') teacherId?: string) {
    const schoolId = req.user.schoolId;
    return this.schedulesService.findAll(schoolId, classId, teacherId);
  }

  @Post()
  create(@Req() req, @Body() createScheduleDto: any) {
    const schoolId = req.user.schoolId;
    return this.schedulesService.create(schoolId, createScheduleDto);
  }
}
