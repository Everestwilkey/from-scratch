import dbPromise from '../database/index.js';

export default async function getLinks(params) {
    const db = await dbPromise;
    return await db.all('SELECT * FROM navigation');
};

