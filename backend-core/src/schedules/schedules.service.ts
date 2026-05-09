import { Injectable, BadRequestException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class SchedulesService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'schedules';
  private readonly classesCollection = 'classes';
  private readonly subjectsCollection = 'subjects';
  private readonly usersCollection = 'users';

  async findAll(schoolId: string, classId?: string, teacherId?: string) {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection).where('schoolId', '==', schoolId);
    
    if (classId) query = query.where('classId', '==', classId);
    if (teacherId) query = query.where('teacherId', '==', teacherId);

    const snapshot = await query.orderBy('dayOfWeek', 'asc').orderBy('startTime', 'asc').get();
    const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    // Manual joins
    for (const s of schedules) {
      s.subject = await this.firestore.findOne(this.subjectsCollection, s.subjectId);
      s.teacher = await this.firestore.findOne(this.usersCollection, s.teacherId);
      s.class = await this.firestore.findOne(this.classesCollection, s.classId);
    }

    return schedules;
  }

  async create(schoolId: string, data: any) {
    const cls = await this.firestore.findOne(this.classesCollection, data.classId) as any;
    if (!cls || cls.schoolId !== schoolId) throw new BadRequestException('Class not found in this school');

    const subject = await this.firestore.findOne(this.subjectsCollection, data.subjectId) as any;
    if (!subject || subject.schoolId !== schoolId) throw new BadRequestException('Subject not found in this school');

    const teacher = await this.firestore.findOne(this.usersCollection, data.teacherId) as any;
    if (!teacher || teacher.schoolId !== schoolId || teacher.role !== 'ENSEIGNANT') {
      throw new BadRequestException('Teacher not found in this school');
    }

    return this.firestore.create(this.collection, {
      schoolId,
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
    });
  }
}

