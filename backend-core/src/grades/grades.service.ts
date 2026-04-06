import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, createGradeDto: CreateGradeDto) {
    // Vérification de base (on pourrait abstraire ça)
    const subject = await this.prisma.subject.findFirst({ where: { id: createGradeDto.subjectId, schoolId } });
    if (!subject) throw new NotFoundException('Matière invalide');
    const classEntity = await this.prisma.class.findFirst({ where: { id: createGradeDto.classId, schoolId } });
    if (!classEntity) throw new NotFoundException('Classe invalide');

    return this.prisma.grade.create({
      data: {
        ...createGradeDto,
        schoolId,
      },
      include: { subject: true }
    });
  }

  async findAllByStudent(schoolId: string, studentId: string, academicYearId?: string) {
    const whereClause: any = { schoolId, studentId };
    if (academicYearId) whereClause.academicYearId = academicYearId;
    return this.prisma.grade.findMany({
      where: whereClause,
      include: { subject: true }
    });
  }

  async calculateStudentAverage(schoolId: string, studentId: string, academicYearId: string) {
    const grades = await this.findAllByStudent(schoolId, studentId, academicYearId);
    if (grades.length === 0) return 0;

    let totalPoints = 0;
    let totalCoefficients = 0;

    grades.forEach(g => {
        const coef = g.subject.coefficient || 1;
        totalPoints += g.value * coef;
        totalCoefficients += coef;
    });

    return totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;
  }
}
