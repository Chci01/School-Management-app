import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ConductService {
    private prisma;
    constructor(prisma: PrismaService);
    submitTeacherConduct(createConductDto: CreateConductDto, user: any): Promise<{
        grade: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        studentId: string;
        teacherId: string;
        month: number;
        appreciation: string | null;
    }>;
    calculateGlobalConduct(dto: CalculateConductDto, user: any): Promise<{
        message: string;
    }>;
    getGlobalConduct(studentId: string, month: number, year: number): Promise<{
        grade: number;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        studentId: string;
        month: number;
        appreciation: string | null;
    } | null>;
}
