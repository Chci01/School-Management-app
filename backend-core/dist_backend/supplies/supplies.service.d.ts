import { CreateSupplyDto } from './dto/create-supply.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SuppliesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSupplyDto: CreateSupplyDto, user: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }>;
    findAllBySchool(user: any): Promise<({
        class: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            academicYearId: string;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    })[]>;
    findByClass(classId: string, user: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }[]>;
    remove(id: string, user: any): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        type: string;
        description: string | null;
        price: number | null;
    }>;
}
