import { AcademicRecordsService } from './academic-records.service';
export declare class AcademicRecordsController {
    private readonly academicRecordsService;
    constructor(academicRecordsService: AcademicRecordsService);
    createOrUpdate(data: any, req: any): Promise<{
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
    findByStudent(studentId: string, req: any): Promise<({
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
    findByClassAndYear(classId: string, yearId: string, req: any): Promise<({
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
