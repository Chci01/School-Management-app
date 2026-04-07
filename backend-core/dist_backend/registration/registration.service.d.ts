import { PrismaService } from '../prisma/prisma.service';
export declare class RegistrationService {
    private prisma;
    constructor(prisma: PrismaService);
    registerSchool(dto: any): Promise<{
        message: string;
        schoolId: string;
        adminMatricule: string;
        trialExpiresAt: Date;
    }>;
    activateLicense(licenseKey: string): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        licenseKey: string | null;
        logo: string | null;
        slogan: string | null;
        address: string | null;
        website: string | null;
        primaryColor: string | null;
        theme: string;
        defaultLanguage: string;
        licenseExpiresAt: Date | null;
        isActive: boolean;
    }>;
}
