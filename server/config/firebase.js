import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// TODO: To use Firebase Admin SDK, you need a Service Account.
// 1. Go to Firebase Console > Project settings > Service accounts
// 2. Generate new private key
// 3. Save the JSON file as 'serviceAccountKey.json' in 'server/config/' folder (DO NOT COMMIT THIS FILE)
// 4. Or set environment variable GOOGLE_APPLICATION_CREDENTIALS to the path of the JSON file

// Check if we are running in a checked-out environment where we might not have the key yet
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// If GOOGLE_APPLICATION_CREDENTIALS is set, initialization is automatic
if (!admin.apps.length) {
    try {
        // Option 1: Using environment variables
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        // Option 2: Using a file
        else {
            // You can explicitly load the file if needed, or rely on GOOGLE_APPLICATION_CREDENTIALS
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
        }
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error.message);
        console.log('Please verify your service account credentials.');
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
