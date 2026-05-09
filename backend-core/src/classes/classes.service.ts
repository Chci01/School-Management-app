import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class ClassesService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'classes';
  private readonly academicYearsCollection = 'academic_years';

  async create(schoolId: string, createClassDto: CreateClassDto) {
    const academicYear = await this.firestore.findOne(this.academicYearsCollection, createClassDto.academicYearId) as any;
    if (!academicYear || academicYear.schoolId !== schoolId) {
      throw new NotFoundException('Année académique invalide ou non trouvée pour cette école');
    }

    return this.firestore.create(this.collection, {
      ...createClassDto,
      schoolId,
    });
  }

  async findAll(schoolId: string, academicYearId?: string) {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection)
      .where('schoolId', '==', schoolId);
    
    if (academicYearId) {
      query = query.where('academicYearId', '==', academicYearId);
    }

    const snapshot = await query.orderBy('level', 'asc').orderBy('name', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(schoolId: string, id: string) {
    const c = await this.firestore.findOne(this.collection, id) as any;
    if (!c || c.schoolId !== schoolId) {
      throw new NotFoundException('Classe non trouvée');
    }
    return c;
  }

  async update(schoolId: string, id: string, updateClassDto: UpdateClassDto) {
    await this.findOne(schoolId, id);
    return this.firestore.update(this.collection, id, updateClassDto);
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}

