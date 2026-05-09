import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    findAll(req: any, classId?: string, teacherId?: string): Promise<({
        class: {
            name: string;
            id: string;
            level: number;
        };
        subject: {
            name: string;
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            coefficient: number;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        room: string | null;
    })[]>;
    create(req: any, createScheduleDto: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        classId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        room: string | null;
    }>;
}
