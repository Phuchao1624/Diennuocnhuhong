import { db } from '../config/firebase.js';

async function seed() {
    try {
        console.log('Seeding Database...');

        // Categories
        const categories = [
            { id: 1, name: 'Điện Lạnh', icon: '❄️' },
            { id: 2, name: 'Điện Gia Dụng', icon: '🏠' },
            { id: 3, name: 'Thiết Bị Nước', icon: '🚰' },
            { id: 4, name: 'Dụng Cụ Cầm Tay', icon: '🔨' }
        ];

        for (const cat of categories) {
            await db.collection('categories').doc(String(cat.id)).set(cat);
        }
        console.log('Seeded Categories');

        // Products
        const products = [
            {
                name: "Máy Khoan Cầm Tay Bosch",
                price: 1500000,
                originalPrice: 1800000,
                rating: 4.5,
                reviewCount: 10,
                image: "https://placehold.co/400",
                categoryId: 4,
                createdAt: new Date().toISOString()
            },
            {
                name: "Ấm Siêu Tốc Sunhouse",
                price: 350000,
                rating: 5,
                reviewCount: 25,
                image: "https://placehold.co/400",
                categoryId: 2,
                createdAt: new Date().toISOString()
            }
        ];

        for (const prod of products) {
            await db.collection('products').add(prod);
        }
        console.log('Seeded Products');

    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

seed();
