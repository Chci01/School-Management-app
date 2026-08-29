import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assign(data: any) {
    const { teacherId, classId, subjectId } = data;
    
    // Check if assignment already exists
    const existing = await this.prisma.teacherAssignment.findUnique({
      where: {
        teacherId_classId_subjectId: { teacherId, classId, subjectId }
      }
    });

    if (existing) throw new ConflictException('Cette attribution existe déjà');

    return this.prisma.teacherAssignment.create({
      data: { teacherId, classId, subjectId }
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.teacherAssignment.findMany({
      where: { teacherId },
      include: { class: true, subject: true }
    });
  }

  async findByClass(classId: string) {
    return this.prisma.teacherAssignment.findMany({
      where: { classId },
      include: { teacher: true, subject: true }
    });
  }

  async remove(id: string) {
    return this.prisma.teacherAssignment.delete({ where: { id } });
  }

  async findAll(schoolId: string) {
    return this.prisma.teacherAssignment.findMany({
      where: { 
        class: { schoolId } 
      },
      include: {
        teacher: true,
        class: true,
        subject: true
      }
    });
  }
}
