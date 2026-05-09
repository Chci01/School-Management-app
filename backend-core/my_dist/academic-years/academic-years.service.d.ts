import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AcademicYearsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, createAcademicYearDto: CreateAcademicYearDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    findAll(schoolId: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }[]>;
    findActive(schoolId: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    findOne(schoolId: string, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    update(schoolId: string, id: string, updateAcademicYearDto: UpdateAcademicYearDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    remove(schoolId: string, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
}
