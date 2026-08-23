const DB_NAME = 'renovation_assistant';
const DB_VERSION = 2;
const IMAGE_STORE = 'images';
const ROLLBACK_STORE = 'rollbacks';

function createId() {
  return globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function openAppDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(IMAGE_STORE)) {
        database.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(ROLLBACK_STORE)) {
        database.createObjectStore(ROLLBACK_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImageData(dataUrl, metadata = {}) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const record = {
    id: metadata.id || createId(),
    blob,
    name: metadata.name || '装修图片',
    type: metadata.type || blob.type || 'image/jpeg',
    size: metadata.size || blob.size,
    createdAt: metadata.createdAt || Date.now(),
  };

  const database = await openAppDatabase();
  try {
    await requestToPromise(
      database.transaction(IMAGE_STORE, 'readwrite').objectStore(IMAGE_STORE).put(record),
    );
  } finally {
    database.close();
  }

  return {
    id: record.id,
    name: record.name,
    type: record.type,
    size: record.size,
  };
}

export async function getImageBlob(id) {
  const database = await openAppDatabase();
  try {
    const record = await requestToPromise(
      database.transaction(IMAGE_STORE).objectStore(IMAGE_STORE).get(id),
    );
    return record?.blob || null;
  } finally {
    database.close();
  }
}

export async function deleteImages(ids) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return;

  const database = await openAppDatabase();
  try {
    const transaction = database.transaction(IMAGE_STORE, 'readwrite');
    const store = transaction.objectStore(IMAGE_STORE);
    uniqueIds.forEach((id) => store.delete(id));
    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export function getStoredImageIds(images = []) {
  return images
    .filter((image) => image && typeof image === 'object' && image.id)
    .map((image) => image.id);
}

export async function persistProblemImages(images = []) {
  const storedImages = [];
  const createdIds = [];

  try {
    for (const image of images) {
      if (typeof image === 'string') {
        const stored = await saveImageData(image);
        storedImages.push(stored);
        createdIds.push(stored.id);
      } else if (image?.dataUrl) {
        const stored = await saveImageData(image.dataUrl, image);
        storedImages.push(stored);
        createdIds.push(stored.id);
      } else if (image?.id) {
        storedImages.push({
          id: image.id,
          name: image.name || '装修图片',
          type: image.type || 'image/jpeg',
          size: Number(image.size) || 0,
        });
      }
    }
    return { storedImages, createdIds };
  } catch (error) {
    await deleteImages(createdIds);
    throw error;
  }
}

