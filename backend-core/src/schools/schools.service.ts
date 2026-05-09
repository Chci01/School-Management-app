import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { FirestoreService } from '../firebase/firestore.service';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

@Injectable()
export class SchoolsService {
  constructor(private firestore: FirestoreService) {}

  private readonly collection = 'schools';
  private readonly vouchersCollection = 'license_vouchers';

  async create(createSchoolDto: CreateSchoolDto) {
    const licenseKey = uuidv4();
    return this.firestore.create(this.collection, {
      ...createSchoolDto,
      licenseKey,
      isActive: true,
      theme: 'light',
      defaultLanguage: 'fr',
    });
  }

  async findAll() {
    return this.firestore.findAll(this.collection);
  }

  async findPublic() {
    const db = this.firestore.getDb();
    const snapshot = await db.collection(this.collection)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        logo: data.logo,
        slogan: data.slogan,
        isActive: data.isActive,
      };
    });
  }

  async findOne(id: string) {
    const school = await this.firestore.findOne(this.collection, id);
    if (!school) {
        throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    return this.firestore.update(this.collection, id, updateSchoolDto);
  }

  async toggleActive(id: string) {
    const school = await this.findOne(id) as any;
    return this.firestore.update(this.collection, id, { isActive: !school.isActive });
  }

  async generateLicense(days: number, userId: string) {
    const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `KALAN-${generateSegment()}-${generateSegment()}`;
    
    return this.firestore.create(this.vouchersCollection, {
      code,
      days,
      createdBy: userId,
      isUsed: false,
    });
  }

  async getAllLicenses() {
    return this.firestore.findAll(this.vouchersCollection);
  }

  async activateLicense(id: string, licenseKey: string, userId: string) {
    const db = this.firestore.getDb();
    const schoolRef = db.collection(this.collection).doc(id);
    const voucherQuery = await db.collection(this.vouchersCollection)
      .where('code', '==', licenseKey)
      .limit(1)
      .get();

    if (voucherQuery.empty) {
      throw new NotFoundException('Clé de licence invalide.');
    }

    const voucherDoc = voucherQuery.docs[0];
    const voucher = voucherDoc.data();

    if (voucher.isUsed) {
      throw new Error('Cette clé de licence a déjà été utilisée.');
    }

    return db.runTransaction(async (transaction) => {
      const schoolDoc = await transaction.get(schoolRef);
      if (!schoolDoc.exists) throw new NotFoundException('École non trouvée.');
      
      const school = schoolDoc.data()!;
      const now = new Date();
      let newExpiration = now;

      if (school.licenseExpiresAt) {
        const currentExp = school.licenseExpiresAt.toDate ? school.licenseExpiresAt.toDate() : new Date(school.licenseExpiresAt);
        if (currentExp > now) {
          newExpiration = currentExp;
        }
      }
      
      newExpiration.setDate(newExpiration.getDate() + voucher.days);

      transaction.update(voucherDoc.ref, {
        isUsed: true,
        usedById: userId,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
        schoolId: id,
      });

      transaction.update(schoolRef, {
        licenseExpiresAt: admin.firestore.Timestamp.fromDate(newExpiration),
      });

      return { success: true, newExpiration };
    });
  }
}


