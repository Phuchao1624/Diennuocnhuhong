import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key-change-in-production';

// Get All Products (Filter, Sort, Search)
router.get('/', async (req, res) => {
    try {
        const { q, categoryId } = req.query;
        const where = {};

        if (q) {
            where.name = { contains: String(q) };
        }
        if (categoryId && categoryId !== '0') {
            where.categoryId = parseInt(String(categoryId));
        }

        // Advanced Filtering
        const { minPrice, maxPrice, rating } = req.query;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(String(minPrice));
            if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
        }
        if (rating) {
            where.rating = { gte: parseFloat(String(rating)) };
        }

        // Sorting
        const { sort } = req.query;
        let orderBy = {};
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        else if (sort === 'price_desc') orderBy = { price: 'desc' };
        else if (sort === 'rating') orderBy = { rating: 'desc' };
        else orderBy = { createdAt: 'desc' }; // Default

        const products = await prisma.product.findMany({ where, orderBy });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                reviews: {
                    include: { user: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create Product (Admin)
router.post('/', async (req, res) => {
    try {
        const product = await prisma.product.create({ data: req.body });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update Product (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete Product (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Create Review
router.post('/reviews', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { productId, rating, comment } = req.body;

        const review = await prisma.review.create({
            data: {
                userId: decoded.userId,
                productId: parseInt(productId),
                rating: parseInt(rating),
                comment
            }
        });

        const reviews = await prisma.review.findMany({ where: { productId: parseInt(productId) } });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { rating: avgRating, reviewCount: reviews.length }
        });

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
