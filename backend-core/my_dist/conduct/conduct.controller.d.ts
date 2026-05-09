import { ConductService } from './conduct.service';
import { CreateConductDto, CalculateConductDto } from './dto/create-conduct.dto';
export declare class ConductController {
    private readonly conductService;
    constructor(conductService: ConductService);
    submitTeacherConduct(createConductDto: CreateConductDto, req: any): Promise<{
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
    calculateGlobalConduct(dto: CalculateConductDto, req: any): Promise<{
        message: string;
    }>;
    getGlobalConduct(studentId: string, month: string, year: string): Promise<{
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
