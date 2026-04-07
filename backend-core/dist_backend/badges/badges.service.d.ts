import { PrismaService } from '../prisma/prisma.service';
export declare class BadgesService {
    private prisma;
    constructor(prisma: PrismaService);
    getTemplate(user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        primaryColor: string;
        secondaryColor: string;
        layout: string;
        showBarcode: boolean;
        customText: string | null;
    }>;
    updateTemplate(updateDto: any, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        primaryColor: string;
        secondaryColor: string;
        layout: string;
        showBarcode: boolean;
        customText: string | null;
    }>;
    generateBadgeForUser(targetUserId: string, user: any): Promise<{
        user: {
            firstName: string;
            lastName: string;
            role: string;
            matricule: string;
            photo: string | null;
        };
        school: {
            name: string | undefined;
            logo: string | null | undefined;
        };
        template: {
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            primaryColor: string;
            secondaryColor: string;
            layout: string;
            showBarcode: boolean;
            customText: string | null;
        };
    }>;
}
