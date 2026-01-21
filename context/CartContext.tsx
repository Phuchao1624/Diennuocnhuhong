import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
    finalTotal: number;
    coupon: { code: string; percent: number } | null;
    applyCoupon: (code: string, percent: number) => void;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);

    const applyCoupon = (code: string, percent: number) => {
        setCoupon({ code, percent });
    };

    const removeCoupon = () => setCoupon(null);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = coupon ? (total * coupon.percent) / 100 : 0;
    const finalTotal = total - discountAmount;

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            total, finalTotal, coupon, applyCoupon, removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
