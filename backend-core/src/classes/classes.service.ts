import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, createClassDto: CreateClassDto) {
    // Verify academicYear exists for this school
    const academicYear = await this.prisma.academicYear.findFirst({
        where: { id: createClassDto.academicYearId, schoolId }
    });
    if (!academicYear) throw new NotFoundException('Année académique invalide ou non trouvée pour cette école');

    return this.prisma.class.create({
      data: {
        ...createClassDto,
        schoolId,
      },
    });
  }

  async findAll(schoolId: string, academicYearId?: string) {
    const whereClause: any = { schoolId };
    if (academicYearId) {
        whereClause.academicYearId = academicYearId;
    }
    return this.prisma.class.findMany({ 
        where: whereClause,
        include: { academicYear: true },
        orderBy: [{ level: 'asc' }, { name: 'asc' }]
    });
  }

  async findOne(schoolId: string, id: string) {
    const c = await this.prisma.class.findFirst({
      where: { id, schoolId },
      include: { academicYear: true },
    });
    if (!c) throw new NotFoundException('Classe non trouvée');
    return c;
  }

  async update(schoolId: string, id: string, updateClassDto: UpdateClassDto) {
    await this.findOne(schoolId, id);
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.class.delete({ where: { id } });
  }
}
