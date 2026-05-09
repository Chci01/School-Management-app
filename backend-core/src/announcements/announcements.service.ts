import { Injectable, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class AnnouncementsService {
    constructor(private firestore: FirestoreService) {}

    private readonly collection = 'announcements';

    async create(createDto: any, user: any) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_ECOLE') {
             throw new ForbiddenException('Only admins can create announcements');
        }

        const data: any = {
            title: createDto.title,
            content: createDto.content,
            target: createDto.target, // ALL, TEACHERS, STUDENTS, PARENTS, CLASSES
            schoolId: user.role === 'SUPER_ADMIN' && createDto.schoolId ? createDto.schoolId : user.schoolId
        };

        if (createDto.targetId) {
            data.targetId = createDto.targetId;
        }

        return this.firestore.create(this.collection, data);
    }

    async findAll(user: any) {
        const db = this.firestore.getDb();
        
        if (user.role === 'SUPER_ADMIN') {
             return this.firestore.findAll(this.collection);
        }

        // Firestore OR is supported in newer SDKs, otherwise we merge results
        // For school specific OR global
        const schoolSnapshot = await db.collection(this.collection)
            .where('schoolId', '==', user.schoolId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const globalSnapshot = await db.collection(this.collection)
            .where('schoolId', '==', null)
            .orderBy('createdAt', 'desc')
            .get();

        const results = [...schoolSnapshot.docs, ...globalSnapshot.docs]
            .map(doc => ({ id: doc.id, ...doc.data() as any }))
            .sort((a, b) => b.createdAt?._seconds - a.createdAt?._seconds);

        return results;
    }
}

