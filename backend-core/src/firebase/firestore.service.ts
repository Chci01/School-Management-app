import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  onModuleInit() {
    if (admin.apps.length === 0) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccount) {
          admin.initializeApp({
              credential: admin.credential.cert(JSON.parse(serviceAccount))
          });
      } else {
          admin.initializeApp();
      }
    }
    this.db = admin.firestore();
  }


  getDb() {
    return this.db;
  }

  async create(collection: string, data: any) {
    const docRef = this.db.collection(collection).doc();
    const id = data.id || docRef.id;
    await docRef.set({ ...data, id, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    return { id, ...data };
  }

  async findAll(collection: string) {
    const snapshot = await this.db.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(collection: string, id: string) {
    const doc = await this.db.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async update(collection: string, id: string, data: any) {
    await this.db.collection(collection).doc(id).update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    return this.findOne(collection, id);
  }

  async delete(collection: string, id: string) {
    await this.db.collection(collection).doc(id).delete();
  }
}
