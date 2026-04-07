import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, createClassDto: CreateClassDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    findAll(schoolId: string, academicYearId?: string): Promise<({
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    })[]>;
    findOne(schoolId: string, id: string): Promise<{
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    update(schoolId: string, id: string, updateClassDto: UpdateClassDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
    remove(schoolId: string, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        academicYearId: string;
    }>;
}
