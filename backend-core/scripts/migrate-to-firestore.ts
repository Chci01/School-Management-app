import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase
if (admin.apps.length === 0) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount))
    });
  } else {
    console.error('ERREUR: FIREBASE_SERVICE_ACCOUNT non trouvé dans .env');
    process.exit(1);
  }
}

const db = admin.firestore();
const prisma = new PrismaClient();

async function migrateCollection(collectionName: string, prismaModel: any) {
  console.log(`🚀 Migration de ${collectionName}...`);
  const items = await prismaModel.findMany();
  console.log(`📦 ${items.length} éléments trouvés.`);

  const batch = db.batch();
  let count = 0;

  for (const item of items) {
    const docRef = db.collection(collectionName).doc(item.id);
    
    // Nettoyage des données pour Firestore (conversion des dates, etc.)
    const cleanedItem: any = {};
    for (const [key, value] of Object.entries(item)) {
      if (value instanceof Date) {
        cleanedItem[key] = admin.firestore.Timestamp.fromDate(value);
      } else {
        cleanedItem[key] = value;
      }
    }

    batch.set(docRef, cleanedItem);
    count++;

    // Firestore batch limit is 500
    if (count === 500) {
      await batch.commit();
      console.log(`✅ Batch de 500 ${collectionName} envoyé.`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }
  console.log(`✨ Migration de ${collectionName} terminée.\n`);
}

async function main() {
  try {
    await migrateCollection('schools', prisma.school);
    await migrateCollection('users', prisma.user);
    await migrateCollection('academic_years', prisma.academicYear);
    await migrateCollection('classes', prisma.class);
    await migrateCollection('subjects', prisma.subject);
    await migrateCollection('grades', prisma.grade);
    await migrateCollection('payments', prisma.payment);
    await migrateCollection('announcements', prisma.announcement);
    await migrateCollection('academic_records', prisma.academicRecord);
    await migrateCollection('document_requests', prisma.documentRequest);
    await migrateCollection('health_records', prisma.healthRecord);
    await migrateCollection('schedules', prisma.schedule);
    await migrateCollection('attendances', prisma.attendance);
    await migrateCollection('homeworks', prisma.homework);
    await migrateCollection('supplies', prisma.supplyItem);
    await migrateCollection('news_items', prisma.newsItem);

    console.log('🎉 TOUTES LES DONNÉES ONT ÉTÉ MIGRÉES AVEC SUCCÈS !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
