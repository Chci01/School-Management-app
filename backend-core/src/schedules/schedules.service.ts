import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, classId?: string, teacherId?: string) {
    let whereClause: any = { class: { schoolId } };

    if (classId) whereClause.classId = classId;
    if (teacherId) whereClause.teacherId = teacherId;

    return this.prisma.scheduleEvent.findMany({
      where: whereClause,
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, firstName: true, lastName: true, matricule: true } },
        class: { select: { id: true, name: true } },
      }
    });
  }

  async create(schoolId: string, data: any) {
    const cls = await this.prisma.class.findUnique({ where: { id: data.classId } });
    if (!cls || cls.schoolId !== schoolId) throw new BadRequestException('Class not found in this school');

    const subject = await this.prisma.subject.findUnique({ where: { id: data.subjectId } });
    if (!subject || subject.schoolId !== schoolId) throw new BadRequestException('Subject not found in this school');

    const teacher = await this.prisma.user.findUnique({ where: { id: data.teacherId } });
    if (!teacher || teacher.schoolId !== schoolId || teacher.role !== 'ENSEIGNANT') {
      throw new BadRequestException('Teacher not found in this school');
    }

    return this.prisma.scheduleEvent.create({
      data: {
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        dayOfWeek: parseInt(data.dayOfWeek.toString(), 10),
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room || null,
      }
    });
  }
}

