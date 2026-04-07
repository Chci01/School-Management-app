import { CreateGradeDto } from './dto/create-grade.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, createGradeDto: CreateGradeDto): Promise<{
        subject: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            coefficient: number;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        studentId: string;
        subjectId: string;
        classId: string;
        value: number;
        evaluationType: string | null;
        term: number | null;
        type: string | null;
    }>;
    findAllByStudent(schoolId: string, studentId: string, academicYearId?: string): Promise<({
        subject: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            coefficient: number;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        studentId: string;
        subjectId: string;
        classId: string;
        value: number;
        evaluationType: string | null;
        term: number | null;
        type: string | null;
    })[]>;
    calculateStudentAverage(schoolId: string, studentId: string, academicYearId: string): Promise<number>;
}
