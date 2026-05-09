import { UsersService } from '../users/users.service';
export declare class SeedService {
    private usersService;
    private readonly logger;
    constructor(usersService: UsersService);
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
