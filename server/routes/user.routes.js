import express from 'express';
import { db } from '../config/firebase.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import { auth } from '../config/firebase.js'; // Admin SDK

const router = express.Router();

// User Profile Update
router.put('/profile', verifyFirebaseToken, async (req, res) => {
    try {
        // In Firebase, basic profile (name, email) updates are often client-side,
        // but if we store custom data in a 'users' collection, we update it here.
        // Also we can update Auth user via Admin SDK.

        const user = req.user;
        const { name, newPassword } = req.body;

        if (name) {
            await auth.updateUser(user.uid, {
                displayName: name
            });
        }
        if (newPassword) {
            await auth.updateUser(user.uid, {
                password: newPassword
            });
        }

        // If we were syncing to a 'users' collection:
        // await db.collection('users').doc(user.uid).set({ name }, { merge: true });

        res.json({ message: 'Updated successfully' });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Get User Addresses (Subcollection)
router.get('/addresses', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const snapshot = await db.collection('users').doc(user.uid).collection('addresses').orderBy('isDefault', 'desc').get();
        const addresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

// Add Address
router.post('/addresses', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const { name, phone, detail, isDefault } = req.body;
        const addressesRef = db.collection('users').doc(user.uid).collection('addresses');

        if (isDefault) {
            // Find current default and unset it
            const defaultSnapshot = await addressesRef.where('isDefault', '==', true).get();
            const batch = db.batch();
            defaultSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });
            await batch.commit();
        }

        const newAddress = await addressesRef.add({
            name, phone, detail, isDefault: !!isDefault,
            createdAt: new Date().toISOString()
        });

        res.json({ id: newAddress.id, name, phone, detail, isDefault });
    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({ error: 'Failed to add address' });
    }
});

// Delete Address
router.delete('/addresses/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        await db.collection('users').doc(user.uid).collection('addresses').doc(id).delete();
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

// Wishlist: Toggle
router.post('/wishlist', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.body;
        const wishlistRef = db.collection('users').doc(user.uid).collection('wishlist');

        // Check if exists
        const snapshot = await wishlistRef.where('productId', '==', productId).limit(1).get();

        if (!snapshot.empty) {
            await snapshot.docs[0].ref.delete();
            res.json({ added: false });
        } else {
            // Fetch product details to store denormalized if needed, or just ID
            const productDoc = await db.collection('products').doc(productId).get();
            const productData = productDoc.data() || {};

            await wishlistRef.add({
                productId,
                product: productData, // Store snapshot of product for easier display
                createdAt: new Date().toISOString()
            });
            res.json({ added: true });
        }
    } catch (error) {
        console.error("Wishlist error:", error);
        res.status(500).json({ error: 'Failed' });
    }
});

// Wishlist: Get All
router.get('/wishlist', verifyFirebaseToken, async (req, res) => {
    try {
        const user = req.user;
        const snapshot = await db.collection('users').doc(user.uid).collection('wishlist').get();
        const wishlist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Newsletter
router.post('/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        // Check uniqueness manually
        const snapshot = await db.collection('newsletter').where('email', '==', email).limit(1).get();
        if (!snapshot.empty) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        await db.collection('newsletter').add({
            email,
            createdAt: new Date().toISOString()
        });
        res.json({ email });
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

export default router;
