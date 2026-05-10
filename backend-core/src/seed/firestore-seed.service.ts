import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreSeedService {
  private readonly logger = new Logger(FirestoreSeedService.name);

  constructor(private firestore: FirestoreService) {}

  async seedAll() {
    const db = this.firestore.getDb();
    this.logger.log('🚀 Début du seeding Firestore...');

    try {
      // 1. Créer une école par défaut (CSKD)
      const schoolId = 'school_cskd_01';
      const schoolRef = db.collection('schools').doc(schoolId);
      const schoolDoc = await schoolRef.get();

      if (!schoolDoc.exists) {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 an d'abonnement

        await schoolRef.set({
          name: 'Groupe Scolaire CSKD',
          email: 'admin@cskd.ml',
          isActive: true,
          licenseKey: 'KALAN-DEMO-2026',
          licenseExpiresAt: admin.firestore.Timestamp.fromDate(expirationDate),
          theme: 'light',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          logo: 'https://firebasestorage.googleapis.com/v0/b/kalan-sira.appspot.com/o/demo%2Flogo_cskd.jpg?alt=media',
          slogan: 'L\'excellence au service de l\'éducation',
        });
        this.logger.log('✅ École CSKD créée.');
      }

      // 2. Créer une année académique
      const yearId = 'year_2025_2026';
      const yearRef = db.collection('academic_years').doc(yearId);
      const yearDoc = await yearRef.get();

      if (!yearDoc.exists) {
        await yearRef.set({
          schoolId: schoolId,
          name: '2025-2026',
          startDate: admin.firestore.Timestamp.fromDate(new Date('2025-09-01')),
          endDate: admin.firestore.Timestamp.fromDate(new Date('2026-06-30')),
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        this.logger.log('✅ Année académique 2025-2026 créée.');
      }

      // 3. Créer un administrateur d'école
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminId = 'user_admin_01';
      const adminRef = db.collection('users').doc(adminId);
      const adminDoc = await adminRef.get();

      if (!adminDoc.exists) {
        await adminRef.set({
          schoolId: schoolId,
          matricule: 'CSKD-ADMIN',
          email: 'admin@cskd.ml',
          password: hashedPassword,
          firstName: 'Administrateur',
          lastName: 'CSKD',
          role: 'ADMIN_ECOLE',
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        this.logger.log('✅ Compte Admin CSKD créé (Pass: admin123).');
      }

      // 4. Créer quelques classes
      const classes = [
        { id: 'class_6eme', name: '6ème Année', level: 'Primaire' },
        { id: 'class_9eme', name: '9ème Année', level: 'Fondamental' },
        { id: 'class_terminale', name: 'Terminale', level: 'Lycée' },
      ];

      for (const cls of classes) {
        const clsRef = db.collection('classes').doc(cls.id);
        const clsDoc = await clsRef.get();
        if (!clsDoc.exists) {
          await clsRef.set({
            ...cls,
            schoolId: schoolId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
      this.logger.log('✅ Classes de base créées.');

      return {
        success: true,
        message: 'Base de données Firestore initialisée avec succès.',
        credentials: {
          school: 'Groupe Scolaire CSKD',
          matricule: 'CSKD-ADMIN',
          password: 'admin123'
        }
      };
    } catch (error) {
      this.logger.error('❌ Erreur seeding:', error);
      throw error;
    }
  }
}
