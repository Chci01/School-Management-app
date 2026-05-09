import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, createSubjectDto: CreateSubjectDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    findAll(schoolId: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }[]>;
    findOne(schoolId: string, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    update(schoolId: string, id: string, updateSubjectDto: UpdateSubjectDto): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
    remove(schoolId: string, id: string): Promise<{
        name: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        coefficient: number;
    }>;
}
