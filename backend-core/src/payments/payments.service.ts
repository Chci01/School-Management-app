import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) {}

    async create(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche } = createPaymentDto;
        
        // Ensure the student belongs to the admin's school (if not super admin)
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!student.schoolId) {
             throw new ForbiddenException('Student is not assigned to any school');
        }

        return this.prisma.payment.create({
            data: {
                studentId,
                amount,
                tranche,
                schoolId: student.schoolId,
                receiptNumber
            }
        });
    }

    async findAll(user: any) {
        if (user.role === 'SUPER_ADMIN') {
            return this.prisma.payment.findMany({ include: { student: true } });
        }
        return this.prisma.payment.findMany({
            where: { schoolId: user.schoolId },
            include: { student: true }
        });
    }

    async findByStudent(studentId: string, user: any) {
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        
        if (!student) {
             throw new ForbiddenException('Student not found');
        }

        // Admins can see their school's students. Parents can see their children. Students can see themselves.
        if (user.role === 'SCHOOL_ADMIN' && student.schoolId !== user.schoolId) throw new ForbiddenException();
        if (user.role === 'STUDENT' && user.id !== studentId) throw new ForbiddenException();
        // PARENT logic would go here: check parentStudent relation.

        return this.prisma.payment.findMany({
            where: { studentId }
        });
    }
}
