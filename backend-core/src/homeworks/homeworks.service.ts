import { Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeworkDto: CreateHomeworkDto) {
    return this.prisma.homework.create({
      data: {
        classId: createHomeworkDto.classId,
        subjectId: createHomeworkDto.subjectId,
        teacherId: createHomeworkDto.teacherId,
        title: createHomeworkDto.title,
        description: createHomeworkDto.description,
        dueDate: new Date(createHomeworkDto.dueDate),
      }
    });
  }

  async findByClass(schoolId: string, classId: string) {
    return this.prisma.homework.findMany({
      where: {
        classId,
        class: { schoolId },
      },
      orderBy: { dueDate: 'asc' },
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true, matricule: true } }
      }
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.homework.findMany({
      where: { teacherId },
      orderBy: { dueDate: 'asc' },
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } }
      }
    });
  }

  async remove(id: string) {
    await this.prisma.homework.delete({ where: { id } });
    return { id };
  }
}

