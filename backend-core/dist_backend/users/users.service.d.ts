import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByMatricule(schoolId: string | null, matricule: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(schoolId: string | null, role?: string, querySchoolId?: string): Promise<User[]>;
    create(data: any): Promise<User>;
    remove(schoolId: string, id: string): Promise<User>;
}
