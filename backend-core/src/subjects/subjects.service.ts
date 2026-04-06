import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        ...createSubjectDto,
        schoolId,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.subject.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' }
    });
  }

  async findOne(schoolId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, schoolId },
    });
    if (!subject) throw new NotFoundException('Matière non trouvée');
    return subject;
  }

  async update(schoolId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(schoolId, id);
    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.subject.delete({ where: { id } });
  }
}
