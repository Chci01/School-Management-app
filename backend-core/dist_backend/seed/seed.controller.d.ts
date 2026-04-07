import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seedSuperAdmin(): Promise<{
        message: string;
        admin?: undefined;
    } | {
        message: string;
        admin: {
            id: string;
            schoolId: string | null;
            role: string;
            matricule: string;
            password: string;
            firstName: string;
            lastName: string;
            email: string | null;
            phone: string | null;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
