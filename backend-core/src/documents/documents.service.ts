import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: any, user: any) {
    const studentId = (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_ECOLE') 
      ? createDocumentDto.studentId 
      : user.userId;

    return this.prisma.documentRequest.create({
      data: {
        type: createDocumentDto.type,
        reason: createDocumentDto.reason,
        studentId: studentId,
        schoolId: user.schoolId || createDocumentDto.schoolId,
        status: 'PENDING',
      },
    });
  }

  async findAll(user: any) {
    const whereClause: any = { schoolId: user.schoolId };
    
    // Students/Parents only see their requests
    if (user.role === 'ELEVE' || user.role === 'PARENT') {
       whereClause.studentId = user.userId;
    }

    return this.prisma.documentRequest.findMany({
      where: whereClause,
      include: {
        student: { select: { firstName: true, lastName: true, matricule: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: string, user: any) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
        throw new ForbiddenException('Only administrators can update document status');
    }

    const doc = await this.prisma.documentRequest.findUnique({ where: { id } });
    if (!doc || doc.schoolId !== user.schoolId) {
        throw new NotFoundException('Document request not found');
    }

    return this.prisma.documentRequest.update({
      where: { id },
      data: { status }
    });
  }
}
