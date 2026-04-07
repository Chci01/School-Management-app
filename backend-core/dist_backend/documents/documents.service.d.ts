import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDocumentDto: any, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
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
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
    })[]>;
    updateStatus(id: string, status: string, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        type: string;
        status: string;
        reason: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
}
