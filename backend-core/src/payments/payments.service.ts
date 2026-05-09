import { Injectable, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class PaymentsService {
    constructor(private firestore: FirestoreService) {}

    private readonly collection = 'payments';
    private readonly usersCollection = 'users';

    async create(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche } = createPaymentDto;
        
        const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!student.schoolId) {
             throw new ForbiddenException('Student is not assigned to any school');
        }

        return this.firestore.create(this.collection, {
            studentId,
            amount,
            tranche,
            schoolId: student.schoolId,
            receiptNumber
        });
    }

    async findAll(user: any) {
        const db = this.firestore.getDb();
        let query = db.collection(this.collection);

        if (user.role !== 'SUPER_ADMIN') {
            query = query.where('schoolId', '==', user.schoolId) as any;
        }

        const snapshot = await query.get();
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        // Manually join students
        for (const p of payments) {
          p.student = await this.firestore.findOne(this.usersCollection, p.studentId);
        }

        return payments;
    }

    async findByStudent(studentId: string, user: any) {
        const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
        
        if (!student) {
             throw new ForbiddenException('Student not found');
        }

        if (user.role === 'ADMIN_ECOLE' && student.schoolId !== user.schoolId) throw new ForbiddenException();
        if (user.role === 'ELEVE' && user.id !== studentId) throw new ForbiddenException();

        const db = this.firestore.getDb();
        const snapshot = await db.collection(this.collection)
            .where('studentId', '==', studentId)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

