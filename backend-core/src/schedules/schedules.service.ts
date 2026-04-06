import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, classId?: string, teacherId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    if (teacherId) where.teacherId = teacherId;

    return this.prisma.schedule.findMany({
      where,
      include: {
        subject: true,
        teacher: { select: { id: true, firstName: true, lastName: true } },
        class: { select: { id: true, name: true, level: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
  }

  async create(schoolId: string, data: any) {
    // Validate that the entities exist in this school
    const cls = await this.prisma.class.findFirst({ where: { id: data.classId, schoolId } });
    if (!cls) throw new BadRequestException('Class not found in this school');

    const subject = await this.prisma.subject.findFirst({ where: { id: data.subjectId, schoolId } });
    if (!subject) throw new BadRequestException('Subject not found in this school');

    const teacher = await this.prisma.user.findFirst({ where: { id: data.teacherId, schoolId, role: 'TEACHER' } });
    if (!teacher) throw new BadRequestException('Teacher not found in this school');

    return this.prisma.schedule.create({
      data: {
        schoolId,
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room,
      }
    });
  }
}
