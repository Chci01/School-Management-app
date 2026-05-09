import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HealthService {
  constructor(
    private firestore: FirestoreService,
    private eventEmitter: EventEmitter2
  ) {}

  private readonly collection = 'health_records';
  private readonly usersCollection = 'users';

  async create(createHealthDto: any, user: any) {
    const record = await this.firestore.create(this.collection, {
      ...createHealthDto,
      schoolId: user.schoolId,
    });

    this.eventEmitter.emit('health.added', {
      studentId: record.studentId,
      symptoms: record.symptoms,
      severity: record.severity,
    });

    return record;
  }

  async findAll(user: any) {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection).where('schoolId', '==', user.schoolId);

    if (user.role === 'ELEVE' || user.role === 'PARENT') {
      query = query.where('studentId', '==', user.userId);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const r of records) {
      r.student = await this.firestore.findOne(this.usersCollection, r.studentId);
    }

    return records;
  }
}

