import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class AcademicYearsService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'academic_years';

  async create(schoolId: string, createAcademicYearDto: CreateAcademicYearDto) {
    const db = this.firestore.getDb();
    if (createAcademicYearDto.isActive) {
      // Deactivate all others
      const snapshot = await db.collection(this.collection)
        .where('schoolId', '==', schoolId)
        .where('isActive', '==', true)
        .get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isActive: false });
      });
      await batch.commit();
    }

    return this.firestore.create(this.collection, {
      ...createAcademicYearDto,
      schoolId,
    });
  }

  async findAll(schoolId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findActive(schoolId: string) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true)
      .limit(1)
      .get();
    
    if (snapshot.empty) throw new NotFoundException('Aucune année académique active trouvée');
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findOne(schoolId: string, id: string) {
    const academicYear = await this.firestore.findOne(this.collection, id) as any;
    if (!academicYear || academicYear.schoolId !== schoolId) {
      throw new NotFoundException('Année académique non trouvée');
    }
    return academicYear;
  }

  async update(schoolId: string, id: string, updateAcademicYearDto: UpdateAcademicYearDto) {
    await this.findOne(schoolId, id);
    const db = this.firestore.getDb();

    if (updateAcademicYearDto.isActive) {
      const snapshot = await db.collection(this.collection)
        .where('schoolId', '==', schoolId)
        .where('isActive', '==', true)
        .get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        if (doc.id !== id) {
          batch.update(doc.ref, { isActive: false });
        }
      });
      await batch.commit();
    }

    return this.firestore.update(this.collection, id, updateAcademicYearDto);
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}

