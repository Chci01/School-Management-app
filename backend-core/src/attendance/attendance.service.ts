import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createBatch(createAttendanceDto: CreateAttendanceDto) {
    const { schoolId, classId, date, records } = createAttendanceDto;

    // We can use a transaction or createMany
    const attendances = records.map((record) => ({
      schoolId,
      classId,
      studentId: record.studentId,
      date: new Date(date),
      status: record.status,
      reason: record.reason,
    }));

    return this.prisma.attendance.createMany({
      data: attendances,
    });
  }

  async findByClassAndDate(schoolId: string, classId: string, date: string) {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return this.prisma.attendance.findMany({
      where: {
        schoolId,
        classId,
        date: {
          gte: searchDate,
          lt: nextDate,
        },
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, matricule: true }
        }
      }
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });
  }
}
