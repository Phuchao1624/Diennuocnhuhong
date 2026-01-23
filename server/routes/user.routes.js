import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key-change-in-production';

// User Profile Update
router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (newPassword) {
            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
            const hashed = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({ where: { id: user.id }, data: { password: hashed, name } });
        } else {
            await prisma.user.update({ where: { id: user.id }, data: { name } });
        }
        res.json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// Get User Addresses
router.get('/addresses', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const addresses = await prisma.address.findMany({
            where: { userId: decoded.userId },
            orderBy: { isDefault: 'desc' }
        });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

// Add Address
router.post('/addresses', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, phone, detail, isDefault } = req.body;

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: decoded.userId },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: decoded.userId,
                name,
                phone,
                detail,
                isDefault: isDefault || false
            }
        });
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add address' });
    }
});

// Delete Address
router.delete('/addresses/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id } = req.params;
        const address = await prisma.address.findFirst({
            where: { id: parseInt(id), userId: decoded.userId }
        });
        if (!address) return res.status(404).json({ error: 'Address not found' });

        await prisma.address.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

// Wishlist: Toggle
router.post('/wishlist', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { productId } = req.body;

        const existing = await prisma.wishlist.findUnique({
            where: { userId_productId: { userId: decoded.userId, productId: parseInt(productId) } }
        });

        if (existing) {
            await prisma.wishlist.delete({ where: { id: existing.id } });
            res.json({ added: false });
        } else {
            await prisma.wishlist.create({
                data: { userId: decoded.userId, productId: parseInt(productId) }
            });
            res.json({ added: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Wishlist: Get All
router.get('/wishlist', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: decoded.userId },
            include: { product: true }
        });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Newsletter
router.post('/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const subscriber = await prisma.newsletter.create({
            data: { email }
        });
        res.json(subscriber);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

export default router;
