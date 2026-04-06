import { Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) {}

  create(createHomeworkDto: CreateHomeworkDto) {
    return this.prisma.homework.create({
      data: {
        ...createHomeworkDto,
        dueDate: new Date(createHomeworkDto.dueDate),
      },
    });
  }

  findByClass(schoolId: string, classId: string) {
    return this.prisma.homework.findMany({
      where: { schoolId, classId },
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  findByTeacher(teacherId: string) {
    return this.prisma.homework.findMany({
      where: { teacherId },
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  remove(id: string) {
    return this.prisma.homework.delete({ where: { id } });
  }
}
