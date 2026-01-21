import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-change-in-production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/products', async (req, res) => {
    try {
        const { q, categoryId } = req.query;
        const where = {};

        if (q) {
            where.name = { contains: String(q) };
        }
        if (categoryId && categoryId !== '0') {
            where.categoryId = parseInt(String(categoryId));
        }

        const products = await prisma.product.findMany({ where });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.post('/api/newsletter', async (req, res) => {
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

// Serve frontend static files in production
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/api/products/:id', async (req, res) => {
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

app.post('/api/orders', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { items, total, address } = req.body;

        const order = await prisma.order.create({
            data: {
                userId: decoded.userId,
                total,
                address,
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

// Admin: Create Product
app.post('/api/products', async (req, res) => {
    try {
        const product = await prisma.product.create({ data: req.body });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Admin: Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Admin: Update Product
app.put('/api/products/:id', async (req, res) => {
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

// Admin: Get All Orders
app.get('/api/admin/orders', async (req, res) => {
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
app.patch('/api/admin/orders/:id', async (req, res) => {
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

app.get('/api/orders/me', async (req, res) => {
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

// Serve frontend static files in production
// Assuming frontend build is in ../dist
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Create Review
app.post('/api/reviews', async (req, res) => {
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

        // Recalculate Product Rating
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

// Update User Profile
app.put('/api/user/profile', async (req, res) => {
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

// Toggle Wishlist
app.post('/api/wishlist', async (req, res) => {
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

// Get User Wishlist
app.get('/api/wishlist', async (req, res) => {
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

// Admin Analytics
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { total: true },
            where: { status: 'DELIVERED' }
        });

        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();
        const totalUsers = await prisma.user.count();

        // Recent Orders
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
app.post('/api/coupons/validate', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
