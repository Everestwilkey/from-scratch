import { query } from 'express';
import dbPromise from '../database/index.js';
import { getGamesByClassification } from './games.js';


export async function addcategory(classification_name) {

    const db = await dbPromise;
    const sql = `INSERT INTO classification(classification_name) VALUES (?)`;
    try {
        return await db.run(sql, [classification_name]);
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}
export async function getClassificationById(id) {
    const db = await dbPromise;
    const query = `
        SELECT *                           /* Need to specify columns or * */
        FROM classification               /* Fixed 'From' to 'FROM' */
        WHERE classification_id = ?       /* Need to use parameter placeholder */
    `;
    return await db.get(query, [id]);
}
export async function deleteCategory(id, movegames = null) {
    const db = await dbPromise;
    let hasActiveTransaction = false;


    try {
        await db.run('BEGIN TRANSACTION');
        hasActiveTransaction = true;
        console.log('Starting deleteCategory - ID:', id, 'Move to:', movegames);

        const games = await getGamesByClassification(id);
        console.log('Games found in category:', games);

        if (movegames) {
            await moveToCategory(id, movegames);
            await deletClassification(id);
            await db.run('COMMIT');
            hasActiveTransaction = false;
            return { success: true };
        } else {
            await deleteGamesinCatagory(id);
            await deletClassification(id);
            await db.run('COMMIT');
            hasActiveTransaction = false;
            return { success: true }
        }
    } catch (error) {
        if (hasActiveTransaction) {
            try {
                await db.run('ROLLBACK');
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        throw error;
    }
}
export async function moveToCategory(movegamesfrom, movegamesto = null) {
    const db = await dbPromise;
    try {
        const games = await getGamesByClassification(movegamesfrom); // Added await here
        if (games && games.length > 0) {
            if (movegamesto) {
                const sql = `
                    UPDATE game
                    SET classification_id = ? 
                    WHERE classification_id = ?`;
                await db.run(sql, [movegamesto, movegamesfrom]); // Fixed parameter order
            }
        }
    }
    catch (error) {
        throw error; // Remove ROLLBACK as it's handled in parent function
    }
}
export async function deleteGamesinCatagory(id) {
    const db = await dbPromise;
    const sql = `
                    DELETE FROM game
                    WHERE classification_id = ?`
    await db.run(sql, [id])
}
export async function deletClassification(id) {
    const db = await dbPromise;
    const sql = `DELETE FROM classification WHERE classification_id = ?`;
    await db.run(sql, [id]);
}