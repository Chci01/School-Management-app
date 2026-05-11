import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirestoreService {
  constructor(private prisma: PrismaService) {}

  collection(name: string) {
    const model = this.getModelName(name);
    const prismaModel = (this.prisma as any)[model];

    if (!prismaModel) {
      console.warn(`[BRIDGE] Model ${model} not found in Prisma for collection ${name}`);
    }

    const createQuery = (where: any = {}, orderBy: any[] = [], take?: number) => {
      const queryObj: any = {
        get: async () => {
          if (!prismaModel) return { docs: [], empty: true, size: 0 };
          const results = await prismaModel.findMany({
            where,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
            take
          });
          return {
            docs: results.map((r: any) => {
              if (r.role === 'TEACHER') r.role = 'ENSEIGNANT';
              if (r.role === 'STUDENT') r.role = 'ELEVE';
              return {
                id: r.id,
                data: () => r,
                ref: { id: r.id }
              };
            }),
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
          if (!prismaModel || !id || id === '') return { exists: false, data: () => null };
          const data = await prismaModel.findUnique({ where: { id } });
          if (data && data.role === 'TEACHER') data.role = 'ENSEIGNANT';
          if (data && data.role === 'STUDENT') data.role = 'ELEVE';
          return { exists: !!data, id: id, data: () => data, ref: { id } };
        },
        set: async (data: any) => {
          if (!prismaModel) return;
          const { id: dataId, createdAt, updatedAt, ...cleanData } = data;
          const finalId = id || dataId;
          
          if (!finalId || finalId === '') {
            return prismaModel.create({ data: cleanData });
          }

          return prismaModel.upsert({
            where: { id: finalId },
            update: cleanData,
            create: { ...cleanData, id: finalId }
          });
        },
        update: (data: any) => {
          if (!prismaModel || !id) return;
          const { id: _, createdAt, updatedAt, ...cleanData } = data;
          return prismaModel.update({ where: { id }, data: cleanData });
        },
        delete: () => {
          if (!prismaModel || !id) return;
          return prismaModel.delete({ where: { id } });
        },
        ref: { id }
      })
    };
  }

  batch() {
    return {
      set: (ref: any, data: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).set(data),
      update: (ref: any, data: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).update(data),
      delete: (ref: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).delete(),
      commit: async () => {}
    };
  }

  async runTransaction(cb: (t: any) => Promise<any>) {
    const transaction = {
      get: (ref: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).get(),
      update: (ref: any, data: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).update(data),
      set: (ref: any, data: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).set(data),
      delete: (ref: any) => this.collection(this.getCollectionFromRef(ref)).doc(ref.id).delete(),
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

  getDb() { return this; }

  private getModelName(collection: string): string {
    const mapping: Record<string, string> = {
      'schools': 'school',
      'users': 'user',
      'academic_years': 'academicYear',
      'classes': 'class',
      'academic_records': 'user', // Mapping for student data
    };
    let model = mapping[collection];
    if (!model) {
      model = collection.endsWith('s') ? collection.slice(0, -1) : collection;
      model = model.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }
    return model;
  }

  private getCollectionFromRef(ref: any): string {
    // Basic heuristic: check if ref has a path or similar, or fallback to knowns
    return 'users'; 
  }
}
