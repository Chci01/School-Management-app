import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('homeworks')
@UseGuards(JwtAuthGuard)
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworksService.create(createHomeworkDto);
  }

  @Get('class/:schoolId/:classId')
  findByClass(
    @Param('schoolId') schoolId: string,
    @Param('classId') classId: string,
  ) {
    return this.homeworksService.findByClass(schoolId, classId);
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.homeworksService.findByTeacher(teacherId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(id);
  }
}
