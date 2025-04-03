import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

interface ObjectStoreSchema {
  name: string;
  options?: IDBObjectStoreParameters;
}

export interface DBConfig {
  /** Database name */
  name: string;

  /** Store version */
  version: number;

  /** Various stores (tables) in DB */
  stores: ObjectStoreSchema[];
}

export interface DBInstance {
  add<T>(store: string, data: T): Promise<number>;
  get<T>(store: string, key: IDBValidKey): Promise<T | undefined>;
  getAll<T>(store: string): Promise<Array<T>>;
  update<T>(store: string, data: T): Promise<void>;
  delete(store: string, key: IDBValidKey): Promise<void>;
  // getLast<T>(store: string): Promise<T>;
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private _platformId = inject(PLATFORM_ID);
  private cache = new Map<string, IDBDatabase>();

  async open(config: DBConfig) {
    if (!isPlatformBrowser(this._platformId)) return;

    if (this.cache.has(config.name)) {
      return this.buildDBInstance(this.cache.get(config.name)!);
    }

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(config.name, config.version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result;

        for (const store of config.stores) {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(
              store.name,
              store.options || { keyPath: 'id', autoIncrement: true },
            );
          }
        }
      };

      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = () => reject(request.error);
    });

    this.cache.set(config.name, db);
    return this.buildDBInstance(db);
  }

  private buildDBInstance(db: IDBDatabase): DBInstance {
    return {
      add: <T>(storeName: string, data: T): Promise<number> =>
        this.runTransaction(db, storeName, 'readwrite', (store) =>
          store.add(data),
        ),

      get: <T>(storeName: string, key: IDBValidKey): Promise<T | undefined> =>
        this.runTransaction(db, storeName, 'readonly', (store) =>
          store.get(key),
        ),

      getAll: <T>(storeName: string): Promise<T[]> =>
        this.runTransaction(db, storeName, 'readonly', (store) =>
          store.getAll(),
        ),

      update: <T>(storeName: string, data: T): Promise<void> =>
        this.runTransaction(db, storeName, 'readwrite', (store) =>
          store.put(data),
        ).then(() => {}),

      delete: (storeName: string, key: IDBValidKey): Promise<void> =>
        this.runTransaction(db, storeName, 'readwrite', (store) =>
          store.delete(key),
        ).then(() => {}),

      // getLast: <T>(storeName: string): Promise<T> =>
      //   this.runTransaction(db, storeName, 'readonly', (store) => 'string'),
    };
  }

  private runTransaction<T>(
    db: IDBDatabase,
    storeName: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = action(store);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }
}
