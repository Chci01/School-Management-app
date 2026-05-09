import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    create(createHealthDto: any, req: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        date: Date;
        symptoms: string;
        actions: string | null;
        severity: string;
    }>;
    findAll(req: any): Promise<({
        student: {
            matricule: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        date: Date;
        symptoms: string;
        actions: string | null;
        severity: string;
    })[]>;
}
