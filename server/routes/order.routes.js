import express from 'express';
import { db } from '../config/firebase.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import { createDocument, getCollection, updateDocument, getDocument } from '../services/firestore.js';

const router = express.Router();

// Create Order (Protected)
router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        const { items, total, address, paymentMethod } = req.body;
        const user = req.user;

        // Add additional product details to items to preserve history if product changes
        // For simplicity, we assume items array already has necessary info or we just store what's sent
        const orderData = {
            userId: user.uid,
            userEmail: user.email,
            items, // Array of { productId, quantity, price, ... }
            total,
            address,
            paymentMethod: paymentMethod || 'COD',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        const order = await createDocument('orders', orderData);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get User Orders (Protected)
router.get('/me', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Get All Orders
router.get('/admin', verifyFirebaseToken, async (req, res) => {
    try {
        // Assume admin check is done or implicitly allowed for now
        const ordersSnapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Update Order Status
router.patch('/admin/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await updateDocument('orders', id, { status });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Admin: Analytics
router.get('/admin/analytics', verifyFirebaseToken, async (req, res) => {
    try {
        // Manual aggregation (expensive on large datasets in Firestore)
        // Ideally use Firestore Count bundle or dedicated aggregation service

        // Count Documents
        const productsCount = (await db.collection('products').count().get()).data().count;
        const ordersCount = (await db.collection('orders').count().get()).data().count;
        // const usersCount = (await db.collection('users').count().get()).data().count; // If we sync users

        // Calculate Revenue (delivered orders only)
        const deliveredOrdersSnapshot = await db.collection('orders').where('status', '==', 'DELIVERED').get();
        let revenue = 0;
        deliveredOrdersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.total) revenue += data.total;
        });

        const recentOrdersSnapshot = await db.collection('orders')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();

        const recentOrders = recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({
            revenue,
            orders: ordersCount,
            products: productsCount,
            users: 0, // Placeholder or sync users to Firestore
            recentOrders
        });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ error: 'Failed' });
    }
});

// Validate Coupon
router.post('/coupons/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const snapshot = await db.collection('coupons').where('code', '==', code).limit(1).get();

        if (snapshot.empty) return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });

        const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

        if (!coupon.isActive) return res.status(400).json({ error: 'Mã giảm giá đã hết hạn' });

        // Parse expiry correctly (handled as string ISO or Timestamp)
        const expiryDate = new Date(coupon.expiry);
        if (new Date() > expiryDate) return res.status(400).json({ error: 'Mã giảm giá đã hết hạn' });

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

export default router;
