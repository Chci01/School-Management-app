import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateBulletin(req: any, studentId: string, term: number, academicYearId: string): Promise<{
        student: {
            id: string;
            matricule: string;
            firstName: string;
            lastName: string;
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
        academicYear: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
        term: number;
        subjects: any[];
        globalAverage: number;
        totalCoefficients: number;
        totalPoints: number;
        generatedAt: Date;
    }>;
    publishTerm(req: any, academicYearId: string, term: number, isPublished: boolean, classId?: string): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        academicYearId: string;
        classId: string | null;
        term: number;
        isPublished: boolean;
    }>;
}
