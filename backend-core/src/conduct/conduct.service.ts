import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConductService {
  constructor(private prisma: PrismaService) {}

  async submitTeacherConduct(createConductDto: CreateConductDto, user: any) {
    if (user.role !== 'ENSEIGNANT') throw new BadRequestException('Only teachers can submit this');

    const existingGrade = await this.prisma.conductGrade.findFirst({
      where: {
        studentId: createConductDto.studentId,
        teacherId: user.id,
        month: createConductDto.month,
        year: createConductDto.year,
      }
    });

    if (existingGrade) {
      return this.prisma.conductGrade.update({
        where: { id: existingGrade.id },
        data: {
          grade: createConductDto.grade,
          appreciation: createConductDto.appreciation
        }
      });
    }

    return this.prisma.conductGrade.create({
      data: {
        studentId: createConductDto.studentId,
        teacherId: user.id,
        month: createConductDto.month,
        year: createConductDto.year,
        grade: createConductDto.grade,
        appreciation: createConductDto.appreciation,
        schoolId: user.schoolId
      }
    });
  }

  async calculateGlobalConduct(dto: CalculateConductDto, user: any) {
    const students = await this.prisma.user.findMany({
      where: { schoolId: user.schoolId, role: 'ELEVE' }
    });

    let processedCount = 0;

    for (const student of students) {
      const grades = await this.prisma.conductGrade.findMany({
        where: {
          studentId: student.id,
          month: dto.month,
          year: dto.year
        }
      });

      if (grades.length === 0) continue;

      const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
      const average = sum / grades.length;

      let appreciation = 'Passable';
      if (average >= 16) appreciation = 'Félicitations';
      else if (average >= 14) appreciation = 'Très Bien';
      else if (average >= 12) appreciation = 'Assez Bien';
      else if (average < 10) appreciation = 'Avertissement Conduct';

      const existingGlobal = await this.prisma.globalConduct.findFirst({
        where: {
          studentId: student.id,
          month: dto.month,
          year: dto.year
        }
      });

      const globalData = {
        schoolId: user.schoolId,
        studentId: student.id,
        month: dto.month,
        year: dto.year,
        grade: average,
        appreciation,
      };

      if (existingGlobal) {
        await this.prisma.globalConduct.update({
          where: { id: existingGlobal.id },
          data: globalData
        });
      } else {
        await this.prisma.globalConduct.create({
          data: globalData
        });
      }
      processedCount++;
    }

    return { message: `Calculated Global Conduct for ${processedCount} students.` };
  }

  async getGlobalConduct(studentId: string, month: number, year: number) {
    const record = await this.prisma.globalConduct.findFirst({
      where: {
        studentId,
        month,
        year
      }
    });

    return record || null;
  }
}

