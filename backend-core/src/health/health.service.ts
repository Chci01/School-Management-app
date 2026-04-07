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
    const record = await this.prisma.healthRecord.create({
      data: {
        ...createHealthDto,
        schoolId: user.schoolId, // Must be logged by staff in the school context
      },
    });

    this.eventEmitter.emit('health.added', {
      studentId: record.studentId,
      symptoms: record.symptoms,
      severity: record.severity,
    });

    return record;
  }

  async findAll(user: any) {
    const whereClause: any = { schoolId: user.schoolId };

    // Parent/Student can only see their own health records
    if (user.role === 'ELEVE' || user.role === 'PARENT') {
      whereClause.studentId = user.userId;
    }

    return this.prisma.healthRecord.findMany({
      where: whereClause,
      include: {
        student: { select: { firstName: true, lastName: true, matricule: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
