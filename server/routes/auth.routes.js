import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Register is handled client-side via Firebase SDK
router.post('/register', (req, res) => {
    res.status(400).json({ error: 'Please use client-side registration with Firebase' });
});

// Login is handled client-side via Firebase SDK
router.post('/login', (req, res) => {
    res.status(400).json({ error: 'Please use client-side login with Firebase' });
});

// Get Me - Verifies token and returns user info
router.get('/me', verifyFirebaseToken, (req, res) => {
    const user = req.user;
    res.json({
        id: user.uid,
        email: user.email,
        name: user.name || user.email?.split('@')[0],
        role: 'user' // Default or fetch from custom claims
    });
});

// Forgot Password - Handled client-side via Firebase SDK
router.post('/forgot-password', (req, res) => {
    res.status(400).json({ error: 'Please use client-side password reset with Firebase' });
});

export default router;
