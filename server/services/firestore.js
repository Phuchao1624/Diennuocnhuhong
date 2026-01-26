import { db } from '../config/firebase.js';

export const getCollection = async (collectionName, filters = [], orderBy = null) => {
    let query = db.collection(collectionName);

    if (filters && filters.length > 0) {
        filters.forEach(filter => {
            if (filter.value !== undefined && filter.value !== null) {
                query = query.where(filter.field, filter.operator, filter.value);
            }
        });
    }

    if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocument = async (collectionName, id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const createDocument = async (collectionName, data) => {
    const docRef = await db.collection(collectionName).add({
        ...data,
        createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
};

export const updateDocument = async (collectionName, id, data) => {
    await db.collection(collectionName).doc(id).update({
        ...data,
        updatedAt: new Date().toISOString()
    });
    return { id, ...data };
};

export const deleteDocument = async (collectionName, id) => {
    await db.collection(collectionName).doc(id).delete();
    return true;
};
