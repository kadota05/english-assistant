import { openDB } from "./db";

export type ChatLog = {
    id?: number;
    UserIntent: string;
    UserExpression: string;
    chatResponse: string;
    timestamp: number;
}

// get all
export async function getAllChatLogs(): Promise<ChatLog[]> {
    const db = await openDB();
    const tx = db.transaction("ChatLogs", "readonly")
    const store = tx.objectStore("ChatLogs")

    const request = store.getAll();
    return new Promise((resolve, reject)=>{
        request.onsuccess = ()=> resolve(request.result as ChatLog[])
        request.onerror = () => reject(request.error)
    })
}

// get one chat
export async function getChatLog(id: number): Promise<ChatLog>{
    const db = await openDB();
    const tx = db.transaction("ChatLogs", "readonly")
    const store = tx.objectStore("ChatLogs")

    const request = store.get(id);
    return new Promise((resolve, reject)=>{
        request.onsuccess = ()=> resolve(request.result as ChatLog)
        request.onerror = () => reject(request.error)
    })
}

// add
export async function addChatLog(log: ChatLog): Promise<IDBValidKey>{
    // 1. データベース開く
    const db = await openDB();
    // 2. トランザクション処理の種類を決める
    const tx = db.transaction("ChatLogs", "readwrite");
    // 3. ストア(テーブルのようなもの)を選択する
    const store = tx.objectStore("ChatLogs")

    const request = store.add(log);
    return new Promise((resolve, reject)=>{
        request.onsuccess = () => {
            resolve(request.result);
        }
        request.onerror = () => {
            reject(request.error);
        }
    })
}

// delete
export async function deleteChatLog(id: number): Promise<void>{
    const db = await openDB()
    const tx = db.transaction("ChatLogs", "readwrite")
    const store = tx.objectStore("ChatLogs")

    const request = store.delete(id)
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    })
}
