import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class AttendanceService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'attendances';
  private readonly usersCollection = 'users';

  async createBatch(createAttendanceDto: CreateAttendanceDto) {
    const { schoolId, classId, date, records } = createAttendanceDto;
    const db = this.firestore.getDb();
    const batch = db.batch();

    records.forEach((record) => {
      const docRef = db.collection(this.collection).doc();
      batch.set(docRef, {
        schoolId,
        classId,
        studentId: record.studentId,
        date: new Date(date),
        status: record.status,
        reason: record.reason,
        createdAt: new Date(),
      });
    });

    await batch.commit();
    return { count: records.length };
  }

  async findByClassAndDate(schoolId: string, classId: string, date: string) {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .where('classId', '==', classId)
      .where('date', '>=', searchDate)
      .where('date', '<', nextDate)
      .get();
    
    const attendances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const a of attendances) {
      a.student = await this.firestore.findOne(this.usersCollection, a.studentId);
    }

    return attendances;
  }

  async findByStudent(studentId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('studentId', '==', studentId)
      .orderBy('date', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

