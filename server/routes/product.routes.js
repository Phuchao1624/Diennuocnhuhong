import express from 'express';
import { db } from '../config/firebase.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import { getCollection, getDocument, createDocument, updateDocument, deleteDocument } from '../services/firestore.js';

const router = express.Router();

// Get All Products (Filter, Sort, Search)
router.get('/', async (req, res) => {
    try {
        const { categoryId, minPrice, maxPrice, rating, sort } = req.query;
        let query = db.collection('products');

        // Firestore simple filters
        if (categoryId && categoryId !== '0') {
            query = query.where('categoryId', '==', parseInt(String(categoryId)));
        }

        // Note: Firestore requires composite indexes for range queries + sorting.
        // We will do basic filtering here and potentially more in memory if needed for complex combos,
        // or ensure indexes are created in Firebase Console.

        if (rating) {
            query = query.where('rating', '>=', parseFloat(String(rating)));
        }

        let snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // In-memory filtering for ranges/search (limitations of Firestore without advanced setup)
        const q = req.query.q ? String(req.query.q).toLowerCase() : '';
        if (q) {
            products = products.filter(p => p.name.toLowerCase().includes(q));
        }

        if (minPrice) {
            products = products.filter(p => p.price >= parseFloat(String(minPrice)));
        }
        if (maxPrice) {
            products = products.filter(p => p.price <= parseFloat(String(maxPrice)));
        }

        // Sorting
        if (sort === 'price_asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            products.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else {
            // Default sort by createdAt desc if available
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await getDocument('products', id);

        if (!productData) return res.status(404).json({ error: 'Product not found' });

        // Fetch reviews (Sub-collection)
        const reviewsSnapshot = await db.collection('products').doc(id).collection('reviews').orderBy('createdAt', 'desc').get();
        const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ ...productData, reviews });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create Product (Admin) - Protected
router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        // Simple role check (assuming custom claims or just checking email for now)
        // For production, set custom claims via Admin SDK or check a 'users' collection

        // Ensure numeric types
        const data = {
            ...req.body,
            price: parseFloat(req.body.price),
            originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
            categoryId: parseInt(req.body.categoryId),
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString()
        };

        const newProduct = await createDocument('products', data);
        res.json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update Product (Admin) - Protected
router.put('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);
        if (data.originalPrice) data.originalPrice = parseFloat(data.originalPrice);

        const updated = await updateDocument('products', id, data);
        res.json(updated);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete Product (Admin) - Protected
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const { id } = req.params;
        await deleteDocument('products', id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Create Review - Protected
router.post('/reviews', verifyFirebaseToken, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const user = req.user; // From verifyFirebaseToken

        const reviewData = {
            userId: user.uid,
            userEmail: user.email,
            // Store basic user info in review to avoid join complexity
            userName: user.name || user.email?.split('@')[0] || 'User',
            rating: parseInt(rating),
            comment,
            createdAt: new Date().toISOString()
        };

        // Add to subcollection
        await db.collection('products').doc(productId).collection('reviews').add(reviewData);

        // Update Aggregate Ratings
        const reviewsSnapshot = await db.collection('products').doc(productId).collection('reviews').get();
        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await updateDocument('products', productId, {
            rating: avgRating,
            reviewCount: reviews.length
        });

        res.json({ message: 'Review added', ...reviewData });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
