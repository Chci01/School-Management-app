import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicRecordsService {
    constructor(private prisma: PrismaService) {}

    async createOrUpdate(data: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
            throw new ForbiddenException('Only admins can manage academic records');
        }

        const student = await this.prisma.user.findUnique({ where: { id: data.studentId } });
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const existingRecord = await this.prisma.academicRecord.findFirst({
            where: {
                studentId: data.studentId,
                academicYearId: data.academicYearId,
            }
        });

        const recordData = {
            studentId: data.studentId,
            academicYearId: data.academicYearId,
            classId: data.classId,
            schoolId: student.schoolId,
            average: parseFloat(data.average) || null,
            status: data.status,
        };

        if (existingRecord) {
            return this.prisma.academicRecord.update({
                where: { id: existingRecord.id },
                data: recordData,
            });
        } else {
            return this.prisma.academicRecord.create({
                data: recordData,
            });
        }
    }

    async findByStudent(studentId: string, user: any) {
        return this.prisma.academicRecord.findMany({
            where: { studentId },
            include: {
                academicYear: true,
                class: true,
            }
        });
    }

    async findByClassAndYear(classId: string, academicYearId: string, user: any) {
        return this.prisma.academicRecord.findMany({
            where: { classId, academicYearId },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, matricule: true }
                },
            }
        });
    }
}

