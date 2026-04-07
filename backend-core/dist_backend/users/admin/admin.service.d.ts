import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from '../users.service';
export declare class AdminService {
    private usersService;
    constructor(usersService: UsersService);
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
