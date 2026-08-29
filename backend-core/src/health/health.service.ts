import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createHealthDto: any, user: any) {
    const record = await this.prisma.medicalRecord.create({
      data: {
        studentId: createHealthDto.studentId,
        date: createHealthDto.date ? new Date(createHealthDto.date) : new Date(),
        reason: createHealthDto.symptoms || createHealthDto.reason || 'Non spécifié',
        treatment: createHealthDto.treatment,
        notes: createHealthDto.severity ? `Sévérité: ${createHealthDto.severity}` : null,
      }
    });

    this.eventEmitter.emit('health.added', {
      studentId: record.studentId,
      symptoms: record.reason,
    });

    return record;
  }

  async findAll(user: any) {
    let whereClause: any = {};
    
    // We assume students/parents can only see their own records
    if (user.role === 'ELEVE' || user.role === 'PARENT') {
      whereClause.studentId = user.userId;
    } else {
       // Only records from the school (through the student relation)
       whereClause.student = { schoolId: user.schoolId };
    }

    return this.prisma.medicalRecord.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, matricule: true }
        }
      }
    });
  }
}

