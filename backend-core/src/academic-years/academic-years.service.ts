import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, createAcademicYearDto: CreateAcademicYearDto) {
    if (createAcademicYearDto.isActive) {
      // Deactivate all others if this new one is set to active
      await this.prisma.academicYear.updateMany({
        where: { schoolId },
        data: { isActive: false },
      });
    }

    return this.prisma.academicYear.create({
      data: {
        ...createAcademicYearDto,
        schoolId,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.academicYear.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
  }

  async findActive(schoolId: string) {
    const activeYear = await this.prisma.academicYear.findFirst({
      where: { schoolId, isActive: true },
    });
    if (!activeYear) throw new NotFoundException('Aucune année académique active trouvée');
    return activeYear;
  }

  async findOne(schoolId: string, id: string) {
    const academicYear = await this.prisma.academicYear.findFirst({
      where: { id, schoolId },
    });
    if (!academicYear) throw new NotFoundException('Année académique non trouvée');
    return academicYear;
  }

  async update(schoolId: string, id: string, updateAcademicYearDto: UpdateAcademicYearDto) {
    await this.findOne(schoolId, id);

    if (updateAcademicYearDto.isActive) {
      await this.prisma.academicYear.updateMany({
        where: { schoolId },
        data: { isActive: false },
      });
    }

    return this.prisma.academicYear.update({
      where: { id },
      data: updateAcademicYearDto,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.academicYear.delete({ where: { id } });
  }
}
