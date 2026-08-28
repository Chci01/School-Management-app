import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createBatch(createAttendanceDto: CreateAttendanceDto) {
    const { classId, date, records } = createAttendanceDto;

    const dataToCreate = records.map((record) => ({
      classId,
      studentId: record.studentId,
      date: new Date(date),
      status: record.status,
      reason: record.reason,
    }));

    const result = await this.prisma.attendance.createMany({
      data: dataToCreate,
    });

    return { count: result.count };
  }

  async findByClassAndDate(schoolId: string, classId: string, date: string) {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Prisma doesn't directly have schoolId on Attendance, but it can be filtered through class: { schoolId }
    return this.prisma.attendance.findMany({
      where: {
        classId,
        date: {
          gte: searchDate,
          lt: nextDate,
        },
        class: {
          schoolId: schoolId,
        },
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, matricule: true, photo: true }
        }
      }
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      include: {
        class: {
          select: { id: true, name: true }
        }
      }
    });
  }
}

