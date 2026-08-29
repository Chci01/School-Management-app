import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    const { id, createdAt, updatedAt, ...rest } = data;
    
    if (rest.isActive) {
      await this.prisma.academicYear.updateMany({
        where: { schoolId, isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.academicYear.create({
      data: {
        ...rest,
        schoolId,
        startDate: new Date(rest.startDate),
        endDate: new Date(rest.endDate),
        isActive: rest.isActive === true || rest.isActive === 'true',
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findActive(schoolId: string) {
    const year = await this.prisma.academicYear.findFirst({
      where: { schoolId, isActive: true },
    });
    if (!year) throw new NotFoundException('Aucune année active');
    return year;
  }

  async findOne(id: string) {
    const year = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!year) throw new NotFoundException('Année non trouvée');
    return year;
  }

  async update(id: string, data: any) {
    const { id: _, createdAt, updatedAt, schoolId, ...rest } = data;
    
    if (rest.isActive === true || rest.isActive === 'true') {
      const year = await this.findOne(id);
      await this.prisma.academicYear.updateMany({
        where: { schoolId: year.schoolId, isActive: true },
        data: { isActive: false },
      });
    }

    const cleanData: any = { ...rest };
    if (rest.startDate) cleanData.startDate = new Date(rest.startDate);
    if (rest.endDate) cleanData.endDate = new Date(rest.endDate);
    if (rest.isActive !== undefined) cleanData.isActive = (rest.isActive === true || rest.isActive === 'true');

    return this.prisma.academicYear.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id: string) {
    return this.prisma.academicYear.delete({ where: { id } });
  }
}
