import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
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
