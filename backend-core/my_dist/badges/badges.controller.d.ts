import { BadgesService } from './badges.service';
export declare class BadgesController {
    private readonly badgesService;
    constructor(badgesService: BadgesService);
    getTemplate(req: any): Promise<{
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
    updateTemplate(updateDto: any, req: any): Promise<{
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
    generateBadgeForUser(targetUserId: string, req: any): Promise<{
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
