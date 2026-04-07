import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any, role?: string, querySchoolId?: string): Promise<{
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
    }[]>;
    create(req: any, createUserDto: any): Promise<{
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
    remove(req: any, id: string): Promise<{
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
