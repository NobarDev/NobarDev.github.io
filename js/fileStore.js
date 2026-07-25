/**
 * fileStore.js — IndexedDB File Storage for Portfolio
 * Stores uploaded files (PDFs, images) in the browser's IndexedDB
 * so they persist and can be loaded from any page without a backend.
 */

const DB_NAME = 'PortfolioFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Save a File/Blob to IndexedDB.
 * @param {string} id - Unique identifier (e.g. "thumb_1721900000" or "file_1721900000")
 * @param {File|Blob} file - The file object to store
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} The id used to store the file
 */
async function saveFile(id, file, fileName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const reader = new FileReader();
        reader.onload = () => {
            const record = {
                id,
                data: reader.result, // ArrayBuffer
                name: fileName,
                type: file.type,
                size: file.size,
                savedAt: Date.now()
            };
            const req = store.put(record);
            req.onsuccess = () => resolve(id);
            req.onerror = () => reject(req.error);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Load a file from IndexedDB and return an Object URL.
 * @param {string} id - The file id
 * @returns {Promise<{url: string, name: string, type: string}|null>}
 */
async function loadFileAsURL(id) {
    if (!id) return null;
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
            const record = req.result;
            if (!record) { resolve(null); return; }
            const blob = new Blob([record.data], { type: record.type });
            const url = URL.createObjectURL(blob);
            resolve({ url, name: record.name, type: record.type });
        };
        req.onerror = () => reject(req.error);
    });
}

/**
 * Delete a file from IndexedDB.
 * @param {string} id - The file id to delete
 */
async function deleteFile(id) {
    if (!id) return;
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

// Expose globally
window.FileStore = { saveFile, loadFileAsURL, deleteFile };
