import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    createBatch(createAttendanceDto: CreateAttendanceDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    findByClassAndDate(schoolId: string, classId: string, date: string): Promise<({
        student: {
            id: string;
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
        classId: string;
        date: Date;
        status: string;
        reason: string | null;
    })[]>;
    findByStudent(studentId: string): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        classId: string;
        date: Date;
        status: string;
        reason: string | null;
    }[]>;
}
