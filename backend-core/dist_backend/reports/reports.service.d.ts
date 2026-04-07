import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ReportsService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    publishTerm(schoolId: string, academicYearId: string, classId: string | null, term: number, isPublished: boolean): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        classId: string | null;
        term: number;
        isPublished: boolean;
    }>;
    generateBulletin(schoolId: string, studentId: string, term: number, academicYearId: string): Promise<{
        student: {
            id: string;
            matricule: string;
            firstName: string;
            lastName: string;
        };
        class: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            academicYearId: string;
        };
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
        term: number;
        subjects: any[];
        globalAverage: number;
        totalCoefficients: number;
        totalPoints: number;
        generatedAt: Date;
    }>;
}
