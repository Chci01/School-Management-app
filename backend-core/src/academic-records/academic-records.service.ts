import { Injectable, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class AcademicRecordsService {
    constructor(private firestore: FirestoreService) {}

    private readonly collection = 'academic_records';
    private readonly usersCollection = 'users';
    private readonly academicYearsCollection = 'academic_years';
    private readonly classesCollection = 'classes';

    async createOrUpdate(data: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
            throw new ForbiddenException('Only admins can manage academic records');
        }

        const student = await this.firestore.findOne(this.usersCollection, data.studentId) as any;
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const db = this.firestore.getDb();
        const snapshot = await db.collection(this.collection)
            .where('studentId', '==', data.studentId)
            .where('academicYearId', '==', data.academicYearId)
            .limit(1)
            .get();

        const recordData = {
            studentId: data.studentId,
            academicYearId: data.academicYearId,
            classId: data.classId,
            schoolId: student.schoolId,
            average: data.average,
            status: data.status,
        };

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await this.firestore.update(this.collection, doc.id, recordData);
            return { id: doc.id, ...recordData };
        } else {
            return this.firestore.create(this.collection, recordData);
        }
    }

    async findByStudent(studentId: string, user: any) {
        const db = this.firestore.getDb();
        const snapshot = await db.collection(this.collection)
            .where('studentId', '==', studentId)
            .get();
        
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        for (const r of records) {
            r.academicYear = await this.firestore.findOne(this.academicYearsCollection, r.academicYearId);
            r.class = await this.firestore.findOne(this.classesCollection, r.classId);
        }

        return records;
    }

    async findByClassAndYear(classId: string, academicYearId: string, user: any) {
        const db = this.firestore.getDb();
        const snapshot = await db.collection(this.collection)
            .where('classId', '==', classId)
            .where('academicYearId', '==', academicYearId)
            .get();
        
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        for (const r of records) {
            r.student = await this.firestore.findOne(this.usersCollection, r.studentId);
        }

        return records;
    }
}

