import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class BadgesService {
  constructor(private firestore: FirestoreService) {}

  private readonly templatesCollection = 'badge_templates';
  private readonly usersCollection = 'users';
  private readonly schoolsCollection = 'schools';

  // Fetch or create the default template for the school
  async getTemplate(user: any) {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.templatesCollection)
        .where('schoolId', '==', user.schoolId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return this.firestore.create(this.templatesCollection, { schoolId: user.schoolId });
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async updateTemplate(updateDto: any, user: any) {
    const template = await this.getTemplate(user) as any;
    await this.firestore.update(this.templatesCollection, template.id, updateDto);
    return { ...template, ...updateDto };
  }

  // Generate badge data for a given user belonging to this school
  async generateBadgeForUser(targetUserId: string, user: any) {
     const targetUser = await this.firestore.findOne(this.usersCollection, targetUserId) as any;

     if (!targetUser || targetUser.schoolId !== user.schoolId) {
         throw new NotFoundException('Utilisateur introuvable dans cette école');
     }

     const school = await this.firestore.findOne(this.schoolsCollection, targetUser.schoolId) as any;
     const template = await this.getTemplate(user);

     return {
         user: {
             firstName: targetUser.firstName,
             lastName: targetUser.lastName,
             role: targetUser.role,
             matricule: targetUser.matricule,
             photo: targetUser.photo,
         },
         school: {
             name: school?.name,
             logo: school?.logo,
         },
         template
     };
  }
}

