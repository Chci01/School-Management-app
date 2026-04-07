import { PrismaService } from '../prisma/prisma.service';
export declare class AcademicRecordsService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrUpdate(data: any, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        studentId: string;
        classId: string;
        average: number;
        status: string;
    }>;
    findByStudent(studentId: string, user: any): Promise<({
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
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
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        studentId: string;
        classId: string;
        average: number;
        status: string;
    })[]>;
    findByClassAndYear(classId: string, academicYearId: string, user: any): Promise<({
        student: {
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
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        studentId: string;
        classId: string;
        average: number;
        status: string;
    })[]>;
}
