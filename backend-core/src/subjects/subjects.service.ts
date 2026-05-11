import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    const { id, createdAt, updatedAt, ...rest } = data;
    return this.prisma.subject.create({
      data: {
        ...rest,
        schoolId,
        coefficient: rest.coefficient ? parseInt(rest.coefficient.toString()) : 1,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Matière non trouvée');
    return subject;
  }

  async update(id: string, data: any) {
    const { id: _, createdAt, updatedAt, schoolId, ...rest } = data;
    const cleanData = { ...rest };
    if (rest.coefficient) cleanData.coefficient = parseInt(rest.coefficient.toString());

    return this.prisma.subject.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id: string) {
    return this.prisma.subject.delete({ where: { id } });
  }
}
