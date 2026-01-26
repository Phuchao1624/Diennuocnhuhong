import express from 'express';
import { getCollection } from '../services/firestore.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await getCollection('categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

export default router;
