import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    create(req: any, createGradeDto: CreateGradeDto): Promise<{
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
    findAllByStudent(req: any, studentId: string, academicYearId?: string): Promise<({
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
    getStudentAverage(req: any, studentId: string, academicYearId: string): Promise<number>;
}
