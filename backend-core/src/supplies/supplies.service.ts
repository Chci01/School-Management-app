import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class SuppliesService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'supplies';
  private readonly classesCollection = 'classes';

  async create(createSupplyDto: CreateSupplyDto, user: any) {
    return this.firestore.create(this.collection, {
      ...createSupplyDto,
      schoolId: user.schoolId,
    });
  }

  async findAllBySchool(user: any) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', user.schoolId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const supplies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const s of supplies) {
      if (s.classId) {
        s.class = await this.firestore.findOne(this.classesCollection, s.classId);
      }
    }

    return supplies;
  }

  async findByClass(classId: string, user: any) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('schoolId', '==', user.schoolId)
      .where('classId', '==', classId)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async remove(id: string, user: any) {
    const supply = await this.firestore.findOne(this.collection, id) as any;
    if (!supply || supply.schoolId !== user.schoolId) {
      throw new NotFoundException('Item not found');
    }
    await this.firestore.delete(this.collection, id);
    return { id };
  }
}

