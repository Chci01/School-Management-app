import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: any, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findByStudent(studentId: string, req: any): Promise<{
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
