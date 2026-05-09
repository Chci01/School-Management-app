import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class SubjectsService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'subjects';

  async create(schoolId: string, createSubjectDto: CreateSubjectDto) {
    return this.firestore.create(this.collection, {
      ...createSubjectDto,
      schoolId,
    });
  }

  async findAll(schoolId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .orderBy('name', 'asc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(schoolId: string, id: string) {
    const subject = await this.firestore.findOne(this.collection, id) as any;
    if (!subject || subject.schoolId !== schoolId) {
      throw new NotFoundException('Matière non trouvée');
    }
    return subject;
  }

  async update(schoolId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(schoolId, id);
    return this.firestore.update(this.collection, id, updateSubjectDto);
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}

