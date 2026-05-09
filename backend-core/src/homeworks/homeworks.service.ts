import { Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class HomeworksService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'homeworks';
  private readonly classesCollection = 'classes';
  private readonly subjectsCollection = 'subjects';
  private readonly usersCollection = 'users';

  async create(createHomeworkDto: CreateHomeworkDto) {
    return this.firestore.create(this.collection, {
      ...createHomeworkDto,
      dueDate: new Date(createHomeworkDto.dueDate),
    });
  }

  async findByClass(schoolId: string, classId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .where('classId', '==', classId)
      .orderBy('dueDate', 'asc')
      .get();
    
    const homeworks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const h of homeworks) {
      h.subject = await this.firestore.findOne(this.subjectsCollection, h.subjectId);
      h.teacher = await this.firestore.findOne(this.usersCollection, h.teacherId);
    }

    return homeworks;
  }

  async findByTeacher(teacherId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('teacherId', '==', teacherId)
      .orderBy('dueDate', 'asc')
      .get();
    
    const homeworks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const h of homeworks) {
      h.class = await this.firestore.findOne(this.classesCollection, h.classId);
      h.subject = await this.firestore.findOne(this.subjectsCollection, h.subjectId);
    }

    return homeworks;
  }

  async remove(id: string) {
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}

