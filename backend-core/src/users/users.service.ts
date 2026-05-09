import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'users';

  async findByMatricule(schoolId: string | null, identifier: string): Promise<any | null> {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection)
      .where('schoolId', '==', schoolId);

    // Try matricule first
    let snapshot = await query.where('matricule', '==', identifier).get();
    if (snapshot.empty) {
      // Try email
      snapshot = await query.where('email', '==', identifier).get();
    }

    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findById(id: string): Promise<any | null> {
    return this.firestore.findOne(this.collection, id);
  }

  async findAll(schoolId: string | null, role?: string, querySchoolId?: string): Promise<any[]> {
    const db = this.firestore.getDb();
    const finalSchoolId = schoolId || querySchoolId;
    
    let query: any = db.collection(this.collection);
    
    if (finalSchoolId) {
      query = query.where('schoolId', '==', finalSchoolId);
    }
    
    if (role) {
      query = query.where('role', '==', role);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const { password, ...user } = doc.data() as any;
      return { id: doc.id, ...user };
    });
  }

  async create(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { password, ...userData } = data;

    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };

    return this.firestore.create(this.collection, userToCreate);
  }

  async remove(schoolId: string, id: string): Promise<any> {
    const user = await this.findById(id);
    if (user && user.schoolId === schoolId) {
      await this.firestore.delete(this.collection, id);
      return user;
    }
    throw new Error('Unauthorized or user not found');
  }
}

