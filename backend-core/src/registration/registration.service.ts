import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private firestore: FirestoreService) {}

  private readonly schoolsCollection = 'schools';
  private readonly usersCollection = 'users';
  private readonly vouchersCollection = 'license_vouchers';

  async registerSchool(dto: any) {
    const { schoolName, email, password } = dto;
    const db = this.firestore.getDb();

    // Check if user already exists
    const existingSnapshot = await db.collection(this.usersCollection)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const trialExpiration = new Date();
    trialExpiration.setDate(trialExpiration.getDate() + 7);

    return db.runTransaction(async (transaction) => {
      const schoolRef = db.collection(this.schoolsCollection).doc();
      const userRef = db.collection(this.usersCollection).doc();

      transaction.set(schoolRef, {
        name: schoolName,
        email: email,
        isActive: true,
        licenseExpiresAt: trialExpiration,
        createdAt: new Date(),
      });

      transaction.set(userRef, {
        schoolId: schoolRef.id,
        matricule: 'ADMIN-01',
        email: email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: schoolName,
        role: 'ADMIN_ECOLE',
        createdAt: new Date(),
      });

      return {
        message: 'Compte créé avec succès. Votre essai gratuit de 7 jours commence maintenant !',
        schoolId: schoolRef.id,
        adminMatricule: 'ADMIN-01',
        trialExpiresAt: trialExpiration,
      };
    });
  }

  async activateLicense(licenseKey: string, schoolId?: string) {
    const db = this.firestore.getDb();
    
    return db.runTransaction(async (transaction) => {
      // Find school
      let schoolRef;
      let schoolData;

      if (schoolId) {
        schoolRef = db.collection(this.schoolsCollection).doc(schoolId);
        const schoolDoc = await transaction.get(schoolRef) as any;
        if (!schoolDoc.exists) throw new BadRequestException('Établissement introuvable.');
        schoolData = schoolDoc.data();
      } else {
        const snapshot = await db.collection(this.schoolsCollection)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
        if (snapshot.empty) throw new BadRequestException('Aucun établissement trouvé.');
        schoolRef = snapshot.docs[0].ref;
        schoolData = snapshot.docs[0].data();
      }

      // Find voucher
      const voucherSnapshot = await db.collection(this.vouchersCollection)
        .where('code', '==', licenseKey)
        .limit(1)
        .get();

      if (voucherSnapshot.empty) throw new BadRequestException('Clé de licence invalide.');
      
      const voucherDoc = voucherSnapshot.docs[0];
      const voucherData = voucherDoc.data() as any;

      if (voucherData.isUsed) throw new BadRequestException('Clé déjà utilisée.');

      // Calculate expiration
      const currentExpiration = schoolData.licenseExpiresAt ? schoolData.licenseExpiresAt.toDate() : new Date();
      const baseDate = currentExpiration > new Date() ? currentExpiration : new Date();
      
      const newExpiration = new Date(baseDate);
      newExpiration.setDate(newExpiration.getDate() + voucherData.days);

      transaction.update(voucherDoc.ref, {
        isUsed: true,
        usedAt: new Date(),
        schoolId: schoolRef.id,
      });

      transaction.update(schoolRef, {
        licenseKey: licenseKey,
        isActive: true,
        licenseExpiresAt: newExpiration,
      });

      return { id: schoolRef.id, ...schoolData, licenseExpiresAt: newExpiration };
    });
  }
}

