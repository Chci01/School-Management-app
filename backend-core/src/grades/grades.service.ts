import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { id, createdAt, updatedAt, ...rest } = data;
    
    return this.prisma.grade.create({
      data: {
        ...rest,
        term: parseInt(rest.term.toString()),
        value: parseFloat(rest.value.toString()),
      },
    });
  }

  async findByStudent(studentId: string, academicYearId: string) {
    return this.prisma.grade.findMany({
      where: { studentId, academicYearId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByClass(classId: string, subjectId: string, academicYearId: string, term: number) {
    return this.prisma.grade.findMany({
      where: { 
        classId, 
        subjectId, 
        academicYearId, 
        term: parseInt(term.toString()) 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    
    const cleanData: any = { ...rest };
    if (rest.term) cleanData.term = parseInt(rest.term.toString());
    if (rest.value) cleanData.value = parseFloat(rest.value.toString());

    return this.prisma.grade.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id: string) {
    return this.prisma.grade.delete({ where: { id } });
  }
}
