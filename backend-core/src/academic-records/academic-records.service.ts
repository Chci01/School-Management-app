import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicRecordsService {
    constructor(private prisma: PrismaService) {}

    async createOrUpdate(data: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'SCHOOL_ADMIN') {
            throw new ForbiddenException('Only admins can manage academic records');
        }

        const student = await this.prisma.user.findUnique({ where: { id: data.studentId } });
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.academicRecord.upsert({
            where: {
                studentId_academicYearId: {
                    studentId: data.studentId,
                    academicYearId: data.academicYearId
                }
            },
            update: {
                average: data.average,
                status: data.status,
                classId: data.classId
            },
            create: {
                studentId: data.studentId,
                academicYearId: data.academicYearId,
                classId: data.classId,
                schoolId: student.schoolId as string,
                average: data.average,
                status: data.status,
            }
        });
    }

    async findByStudent(studentId: string, user: any) {
         return this.prisma.academicRecord.findMany({
             where: { studentId },
             include: { academicYear: true, class: true }
         });
    }

    async findByClassAndYear(classId: string, academicYearId: string, user: any) {
        return this.prisma.academicRecord.findMany({
            where: { classId, academicYearId },
            include: { student: true }
        });
    }
}
