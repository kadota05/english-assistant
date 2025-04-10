export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChatDB", 2);

    // 1. onupgradeneededの設定
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // ストアが存在しない場合に作成する
      // I. ChatLogs(ユーザのinputとAIの回答に関するストア)
      if (!db.objectStoreNames.contains("ChatLogs")) {
        const store = db.createObjectStore("ChatLogs", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by_timestamp", "timestamp", { unique: false });
      }

      // II. Exercises(chatResponseに基づいて作成する演習問題のストア)
      if (!db.objectStoreNames.contains("Exercises")) {
        const store = db.createObjectStore("Exercises", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by_chatResponse", "chatResponse", { unique: true });
        store.createIndex("by_isLike", "isLike", { unique: false });
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
