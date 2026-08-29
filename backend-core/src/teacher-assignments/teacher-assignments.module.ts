import { Module } from '@nestjs/common';
import { TeacherAssignmentsService } from './teacher-assignments.service';
import { TeacherAssignmentsController } from './teacher-assignments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TeacherAssignmentsService],
  controllers: [TeacherAssignmentsController]
})
export class TeacherAssignmentsModule {}
