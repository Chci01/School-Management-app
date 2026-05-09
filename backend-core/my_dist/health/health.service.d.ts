import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class HealthService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(createHealthDto: any, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        date: Date;
        symptoms: string;
        actions: string | null;
        severity: string;
    }>;
    findAll(user: any): Promise<({
        student: {
            matricule: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        date: Date;
        symptoms: string;
        actions: string | null;
        severity: string;
    })[]>;
}
