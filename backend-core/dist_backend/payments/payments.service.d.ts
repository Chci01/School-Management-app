import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: any, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        amount: number;
        tranche: number;
        date: Date;
        receiptNumber: string;
    }>;
    findAll(user: any): Promise<({
        student: {
            id: string;
            schoolId: string | null;
            role: string;
            matricule: string;
            password: string;
            firstName: string;
            lastName: string;
            email: string | null;
            phone: string | null;
            photo: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        amount: number;
        tranche: number;
        date: Date;
        receiptNumber: string;
    })[]>;
    findByStudent(studentId: string, user: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        amount: number;
        tranche: number;
        date: Date;
        receiptNumber: string;
    }[]>;
}
