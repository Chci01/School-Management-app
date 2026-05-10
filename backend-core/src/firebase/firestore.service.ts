import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirestoreService {
  constructor(private prisma: PrismaService) {}

  collection(name: string) {
    const model = this.getModelName(name);
    const prismaModel = (this.prisma as any)[model];

    const createQuery = (where: any = {}, orderBy: any[] = [], take?: number) => {
      const queryObj: any = {
        get: async () => {
          const results = await prismaModel.findMany({
            where,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
            take
          });
          return {
            docs: results.map((r: any) => ({
              id: r.id,
              data: () => r,
              ref: { id: r.id }
            })),
            empty: results.length === 0,
            size: results.length
          };
        },
        where: (field: string, op: string, value: any) => {
          return createQuery({ ...where, [field]: value }, orderBy, take);
        },
        orderBy: (field: string, dir: string) => {
          return createQuery(where, [...orderBy, { [field]: dir }], take);
        },
        limit: (n: number) => {
          return createQuery(where, orderBy, n);
        }
      };
      return queryObj;
    };

    return {
      ...createQuery(),
      doc: (id?: string) => ({
        get: async () => {
          const data = await prismaModel.findUnique({ where: { id } });
          return {
            exists: !!data,
            id: id,
            data: () => data,
            ref: { id }
          };
        },
        set: (data: any) => prismaModel.upsert({
          where: { id: id || data.id },
          update: data,
          create: { ...data, id: id || data.id }
        }),
        update: (data: any) => prismaModel.update({ where: { id }, data }),
        delete: () => prismaModel.delete({ where: { id } }),
        ref: { id }
      })
    };
  }

  // Mocking Batch
  batch() {
    return {
      set: (ref: any, data: any) => this.create(this.getCollectionFromRef(ref), data),
      update: (ref: any, data: any) => this.update(this.getCollectionFromRef(ref), ref.id, data),
      delete: (ref: any) => this.delete(this.getCollectionFromRef(ref), ref.id),
      commit: async () => { /* Simulated commit */ }
    };
  }

  // Mocking Transactions
  async runTransaction(cb: (t: any) => Promise<any>) {
    const transaction = {
      get: (ref: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).get(),
      update: (ref: any, data: any) => this.update(this.getCollectionFromRef(ref), ref.id, data),
      set: (ref: any, data: any) => this.create(this.getCollectionFromRef(ref), data),
      delete: (ref: any) => this.delete(this.getCollectionFromRef(ref), ref.id),
    };
    return cb(transaction);
  }

  async create(collection: string, data: any) {
    return this.collection(collection).doc(data.id).set(data);
  }

  async findAll(collection: string) {
    const res = await this.collection(collection).get();
    return res.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  async findOne(collection: string, id: string) {
    const doc = await this.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async update(collection: string, id: string, data: any) {
    return this.collection(collection).doc(id).update(data);
  }

  async delete(collection: string, id: string) {
    return this.collection(collection).doc(id).delete();
  }

  getDb() {
    return this;
  }

  private getModelName(collection: string): string {
    const mapping: Record<string, string> = {
      'schools': 'school',
      'users': 'user',
      'academic_years': 'academicYear',
      'classes': 'class',
    };
    let model = mapping[collection];
    if (!model) {
      model = collection.endsWith('s') ? collection.slice(0, -1) : collection;
      if (model.includes('_')) {
          model = model.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      }
    }
    return model;
  }

  private getCollectionFromRef(ref: any): string {
    // This is a guess based on how ref is passed. In a real shim this would be more complex.
    return 'unknown'; 
  }
}
