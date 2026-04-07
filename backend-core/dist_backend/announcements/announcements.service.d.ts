import { PrismaService } from '../prisma/prisma.service';
export declare class AnnouncementsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any, user: any): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        target: string;
        targetId: string | null;
    }>;
    findAll(user: any): Promise<{
        id: string;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        target: string;
        targetId: string | null;
    }[]>;
}
