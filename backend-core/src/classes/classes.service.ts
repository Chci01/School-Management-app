import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    // Hardening: Strip auto-fields and handle empty strings
    const { id, createdAt, updatedAt, ...rest } = data;
    
    return this.prisma.class.create({
      data: {
        ...rest,
        schoolId,
        capacity: rest.capacity ? parseInt(rest.capacity.toString()) : 0,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      include: { academicYear: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id },
      include: { academicYear: true },
    });
    if (!cls) throw new NotFoundException('Classe non trouvée');
    return cls;
  }

  async update(id: string, data: any) {
    const { id: _, createdAt, updatedAt, schoolId, ...rest } = data;
    
    // Convert types if necessary
    const cleanData = { ...rest };
    if (rest.capacity) cleanData.capacity = parseInt(rest.capacity.toString());

    return this.prisma.class.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id: string) {
    return this.prisma.class.delete({
      where: { id },
    });
  }
}
