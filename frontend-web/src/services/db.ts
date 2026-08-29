import Dexie, { type Table } from 'dexie';

// Define our interfaces for Local Data
export interface Establishment {
  id?: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  // Local state marker
  _syncStatus?: 'synced' | 'pending' | 'error';
}

export interface SyncQueueItem {
  id?: number;
  method: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

export class AppDatabase extends Dexie {
  establishments!: Table<Establishment>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('KalansiraLocalDB');
    
    this.version(1).stores({
      // Primary keys and indexed props
      establishments: 'id, name, _syncStatus',
      syncQueue: '++id, method, endpoint, timestamp'
    });
  }
}

export const db = new AppDatabase();
