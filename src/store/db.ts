// store/db.ts
import { ChatLog } from './chatLogService';

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChatDB", 1);

    // 1. onupgradeneededの設定
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // ストアが存在しない場合に作成する
      if (!db.objectStoreNames.contains("ChatLogs")) {
        const store = db.createObjectStore("ChatLogs", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by_timestamp", "timestamp", { unique: false });
      }
    };

    // 2. onsuccessの設定
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    // 3. onerrorの設定
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    }
  })
}
