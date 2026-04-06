import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('batch')
  createBatch(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.createBatch(createAttendanceDto);
  }

  @Get('class/:schoolId/:classId')
  findByClassAndDate(
    @Param('schoolId') schoolId: string,
    @Param('classId') classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.findByClassAndDate(schoolId, classId, date);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }
}
