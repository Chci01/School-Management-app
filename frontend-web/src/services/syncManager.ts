import { api } from './api';
import { db } from './db';

class OfflineSyncManager {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Attempt to sync immediately if we start online
    if (this.isOnline) {
      this.sync();
    }
    
    // Also set up a periodic sync every 30 seconds just in case
    setInterval(() => {
        if (this.isOnline && !this.isSyncing) {
            this.sync();
        }
    }, 30000);
  }

  private handleOnline = () => {
    this.isOnline = true;
    console.log('[SyncManager] Back online, starting sync...');
    this.sync();
  };

  private handleOffline = () => {
    this.isOnline = false;
    console.log('[SyncManager] Went offline. Requests will be queued.');
  };

  public async addToQueue(method: 'POST' | 'PUT' | 'DELETE', endpoint: string, payload: any) {
    await db.syncQueue.add({
      method,
      endpoint,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    });
    
    if (this.isOnline) {
      this.sync();
    }
  }

  public async sync() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const queue = await db.syncQueue.orderBy('timestamp').toArray();
      
      for (const item of queue) {
        if (!item.id) continue;
        
        try {
          console.log(`[SyncManager] Syncing ${item.method} ${item.endpoint}`);
          
          if (item.method === 'POST') await api.post(item.endpoint, item.payload);
          else if (item.method === 'PUT') await api.put(item.endpoint, item.payload);
          else if (item.method === 'DELETE') await api.delete(item.endpoint);
          
          // If successful, remove from queue
          await db.syncQueue.delete(item.id);
          
          // Also update the local database state to 'synced' if it was a school creation
          if (item.endpoint === '/schools' && item.payload.id) {
             await db.establishments.update(item.payload.id, { _syncStatus: 'synced' });
          }
          
        } catch (error: any) {
          console.error(`[SyncManager] Failed to sync item ${item.id}`, error);
          // If the error is not a network error (e.g. 400 Bad Request), we might want to drop it or mark it as error 
          // For now, we increment retryCount
          await db.syncQueue.update(item.id, { retryCount: item.retryCount + 1 });
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Wrapper for API calls that need offline support
  public async mutateOfflineFirst(method: 'POST' | 'PUT' | 'DELETE', endpoint: string, payload: any, localTable?: any) {
    if (localTable) {
        // Save to local db first as pending
        await localTable.put({ ...payload, _syncStatus: 'pending' });
    }
    
    if (this.isOnline) {
      try {
        let response;
        if (method === 'POST') response = await api.post(endpoint, payload);
        else if (method === 'PUT') response = await api.put(endpoint, payload);
        else if (method === 'DELETE') response = await api.delete(endpoint);
        
        // If succeeded directly, update local db status
        if (localTable && payload.id) {
            await localTable.update(payload.id, { _syncStatus: 'synced' });
        }
        return response?.data;
      } catch (error) {
        // Fallback to queue if the network failed despite the browser thinking we are online
        await this.addToQueue(method, endpoint, payload);
        return { offlineFallback: true, pending: true };
      }
    } else {
      // Queue it directly
      await this.addToQueue(method, endpoint, payload);
      return { offlineFallback: true, pending: true };
    }
  }
}

export const syncManager = new OfflineSyncManager();
