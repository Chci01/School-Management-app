import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class DocumentsService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'document_requests';
  private readonly usersCollection = 'users';

  async create(createDocumentDto: any, user: any) {
    const studentId = (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_ECOLE') 
      ? createDocumentDto.studentId 
      : user.userId;

    return this.firestore.create(this.collection, {
      type: createDocumentDto.type,
      reason: createDocumentDto.reason,
      studentId: studentId,
      schoolId: user.schoolId || createDocumentDto.schoolId,
      status: 'PENDING',
    });
  }

  async findAll(user: any) {
    const db = this.firestore.getDb();
    let query = db.collection(this.collection).where('schoolId', '==', user.schoolId);
    
    if (user.role === 'ELEVE' || user.role === 'PARENT') {
       query = query.where('studentId', '==', user.userId);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    for (const d of docs) {
      d.student = await this.firestore.findOne(this.usersCollection, d.studentId);
    }

    return docs;
  }

  async updateStatus(id: string, status: string, user: any) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
        throw new ForbiddenException('Only administrators can update document status');
    }

    const doc = await this.firestore.findOne(this.collection, id) as any;
    if (!doc || doc.schoolId !== user.schoolId) {
        throw new NotFoundException('Document request not found');
    }

    return this.firestore.update(this.collection, id, { status });
  }
}

