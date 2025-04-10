import { openDB } from './db'

export type exercise = {
    chatResponse: string,
    exerciseResponse: string,
    isLike: boolean,
    numReview: null,
}

// get all
export async function getAllExercises(): Promise<exercise[]> {
    const db = await openDB();
    const tx = db.transaction("Exercises", "readonly")
    const store = tx.objectStore("Exercises")

    const request = store.getAll();
    return new Promise((resolve, reject)=>{
        request.onsuccess = ()=> resolve(request.result as exercise[])
        request.onerror = () => reject(request.error)
    })
}

// get one chat
export async function getExercise(chatResponse: string): Promise<exercise>{
    const db = await openDB();
    const tx = db.transaction("Exercises", "readonly")
    const store = tx.objectStore("Exercises")
    const index = store.index("by_chatResponse");

    const request = index.get(chatResponse);
    return new Promise((resolve, reject)=>{
        request.onsuccess = ()=> resolve(request.result as exercise)
        request.onerror = () => reject(request.error)
    })
}

// add
export async function addExercise(log: exercise): Promise<IDBValidKey>{
    // 1. データベース開く
    const db = await openDB();
    // 2. トランザクション処理の種類を決める
    const tx = db.transaction("Exercises", "readwrite");
    // 3. ストア(テーブルのようなもの)を選択する
    const store = tx.objectStore("Exercises")

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

// edit
export async function editExercise(log: exercise): Promise<IDBValidKey>{
    // 1. データベース開く
    const db = await openDB();
    // 2. トランザクション処理の種類を決める
    const tx = db.transaction("Exercises", "readwrite");
    // 3. ストア(テーブルのようなもの)を選択する
    const store = tx.objectStore("Exercises")

    const request = store.put(log);
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
export async function deleteExercise(chatResponse: string): Promise<void>{
    const db = await openDB()
    const tx = db.transaction("Exercises", "readwrite")
    const store = tx.objectStore("Exercises")
    const index = store.index("by_chatResponse");

    const request = index.getKey(chatResponse);
    return new Promise((resolve, reject) => {
        // 二重になってて分かりづらいけど
        // request(chatResponseに対するキーがあるか)に対してのsuccess/errorの処理
        request.onsuccess = () => {
            const key = request.result;
            if(key !== undefined && key !== null){
                const deleteRequest = store.delete(key);
                // ここはdeleteRequest(deleteできたかどうか)に対してのsuccess/errorの処理
                deleteRequest.onsuccess = () => resolve();
                deleteRequest.onerror = () => reject(deleteRequest.error);
            }else{
                resolve();
            }
        };
        request.onerror = () => reject(request.error);
    })
}
