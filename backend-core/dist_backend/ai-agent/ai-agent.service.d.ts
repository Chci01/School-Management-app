import { PrismaService } from '../prisma/prisma.service';
export declare class AiAgentService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleBulletinPublishedEvent(payload: {
        schoolId: string;
        academicYearId: string;
        classId?: string;
        term: number;
    }): Promise<void>;
    handleAnnouncementCreatedEvent(payload: {
        id: string;
        title: string;
        target: string;
    }): Promise<void>;
    handleHealthAddedEvent(payload: {
        studentId: string;
        symptoms: string;
        severity: string;
    }): Promise<void>;
}
