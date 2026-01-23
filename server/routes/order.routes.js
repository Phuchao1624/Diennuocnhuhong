import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key-change-in-production';

// Create Order
router.post('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { items, total, address, paymentMethod } = req.body;

        const order = await prisma.order.create({
            data: {
                userId: decoded.userId,
                total,
                address,
                paymentMethod: paymentMethod || 'COD',
                status: 'PENDING',
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get User Orders
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const orders = await prisma.order.findMany({
            where: { userId: decoded.userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Get All Orders
router.get('/admin', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } }, user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Update Order Status
router.patch('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Admin: Analytics
router.get('/admin/analytics', async (req, res) => {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { total: true },
            where: { status: 'DELIVERED' }
        });

        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();
        const totalUsers = await prisma.user.count();

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        res.json({
            revenue: totalRevenue._sum.total || 0,
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Validate Coupon
router.post('/coupons/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await prisma.coupon.findUnique({ where: { code } });

        if (!coupon) return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
        if (!coupon.isActive) return res.status(400).json({ error: 'Mã giảm giá đã hết hạn' });
        if (new Date() > new Date(coupon.expiry)) return res.status(400).json({ error: 'Mã giảm giá đã hết hạn' });

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

export default router;
