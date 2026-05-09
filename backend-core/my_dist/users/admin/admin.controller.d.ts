import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<{
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
    }>;
}
