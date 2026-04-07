import { PrismaService } from '../prisma/prisma.service';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(schoolId: string, classId?: string, teacherId?: string): Promise<({
        class: {
            name: string;
            id: string;
            level: number;
        };
        subject: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            coefficient: number;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        room: string | null;
    })[]>;
    create(schoolId: string, data: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        room: string | null;
    }>;
}
