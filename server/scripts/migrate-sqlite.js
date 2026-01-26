import sqlite3 from 'sqlite3';
import { db } from '../config/firebase.js';

const SQLite3 = sqlite3.verbose();
const DB_PATH = './server/dev.db'; // Adjust path if you restore the file here

async function migrate() {
    console.log(`Connecting to SQLite at ${DB_PATH}...`);

    const sdb = new SQLite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error("Error opening database. Make sure 'dev.db' is restored to 'server/' directory.");
            console.error(err.message);
            process.exit(1);
        }
    });

    try {
        // Migrate Categories
        console.log('Migrating Categories...');
        const categories = await query(sdb, 'SELECT * FROM Category');
        const batch = db.batch();
        for (const cat of categories) {
            const ref = db.collection('categories').doc(String(cat.id));
            batch.set(ref, {
                id: cat.id,
                name: cat.name,
                icon: cat.icon
            });
        }
        await batch.commit();
        console.log(`Migrated ${categories.length} categories.`);

        // Migrate Products
        console.log('Migrating Products...');
        const products = await query(sdb, 'SELECT * FROM Product');
        // Batch limit is 500, simple implementation assumes < 500 or just does sequential for safety
        for (const prod of products) {
            await db.collection('products').add({
                ...prod,
                price: parseFloat(prod.price),
                categoryId: prod.categoryId,
                createdAt: new Date().toISOString()
            });
        }
        console.log(`Migrated ${products.length} products.`);

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        sdb.close();
    }
}

function query(db, sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

migrate();
