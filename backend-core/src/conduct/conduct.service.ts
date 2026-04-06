import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConductService {
  constructor(private prisma: PrismaService) {}

  async submitTeacherConduct(createConductDto: CreateConductDto, user: any) {
    if (user.role !== 'TEACHER') throw new BadRequestException('Only teachers can submit this');

    const existing = await this.prisma.conductGrade.findFirst({
      where: {
        studentId: createConductDto.studentId,
        teacherId: user.id,
        month: createConductDto.month,
        year: createConductDto.year,
      }
    });

    if (existing) {
      return this.prisma.conductGrade.update({
        where: { id: existing.id },
        data: { grade: createConductDto.grade, appreciation: createConductDto.appreciation }
      });
    }

    return this.prisma.conductGrade.create({
      data: {
        ...createConductDto,
        teacherId: user.id,
      }
    });
  }

  async calculateGlobalConduct(dto: CalculateConductDto, user: any) {
    // 1. Get all students in the school
    const students = await this.prisma.user.findMany({
      where: { schoolId: user.schoolId, role: 'STUDENT' }
    });

    let processedCount = 0;

    // 2. For each student, find their teacher conduct grades for the month
    for (const student of students) {
      const grades = await this.prisma.conductGrade.findMany({
        where: { studentId: student.id, month: dto.month, year: dto.year }
      });

      if (grades.length === 0) continue; // No teacher graded this student

      // Calculate average
      const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
      const average = sum / grades.length;

      // Auto appreciation
      let appreciation = 'Passable';
      if (average >= 16) appreciation = 'Félicitations';
      else if (average >= 14) appreciation = 'Très Bien';
      else if (average >= 12) appreciation = 'Assez Bien';
      else if (average < 10) appreciation = 'Avertissement Conduct';

      // Upsert into GlobalConduct
      await this.prisma.globalConduct.upsert({
        where: {
          studentId_month_year: {
            studentId: student.id,
            month: dto.month,
            year: dto.year,
          }
        },
        update: {
          grade: average,
          appreciation,
        },
        create: {
          schoolId: user.schoolId,
          studentId: student.id,
          month: dto.month,
          year: dto.year,
          grade: average,
          appreciation,
        }
      });
      processedCount++;
    }

    return { message: `Calculated Global Conduct for ${processedCount} students.` };
  }

  async getGlobalConduct(studentId: string, month: number, year: number) {
    return this.prisma.globalConduct.findUnique({
      where: {
        studentId_month_year: {
          studentId,
          month,
          year,
        }
      }
    });
  }
}
