import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, total, finalTotal, coupon, applyCoupon, removeCoupon } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart_off</span>
                <h2 className="text-xl font-bold text-gray-500">Giỏ hàng trống</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1000px] w-full flex flex-col gap-8">
                <h1 className="text-3xl font-bold dark:text-white">Giỏ hàng của bạn</h1>

                <div className="flex flex-col gap-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4 bg-white dark:bg-[#1a2632] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain rounded bg-gray-50" />
                            <div className="flex-1">
                                <h3 className="font-bold dark:text-white line-clamp-1">{item.product.name}</h3>
                                <p className="text-primary font-bold">{item.product.price.toLocaleString('vi-VN')}đ</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:text-white">-</button>
                                <span className="w-8 text-center font-bold dark:text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:text-white">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-lg border-t-2 border-primary">
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Tổng tiền</span>
                        <span className="text-2xl font-black text-primary">{finalTotal.toLocaleString('vi-VN')}đ</span>
                        {coupon && <span className="text-sm text-green-500 line-through">{total.toLocaleString('vi-VN')}đ</span>}
                    </div>
                    <Link to="/checkout" className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all">
                        Thanh Toán
                    </Link>
                </div>

                {/* Coupon Section */}
                <CouponInput />
            </div>
        </div>
    );
};

const CouponInput = () => {
    const { applyCoupon, removeCoupon, coupon } = useCart();
    const { showToast } = useToast();
    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleApply = async () => {
        if (!code) return;
        setLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (res.ok) {
                applyCoupon(data.code, data.discountPercent);
                showToast(`Áp dụng mã ${data.code} thành công! -${data.discountPercent}%`, 'success');
                setCode('');
            } else {
                showToast(data.error, 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (coupon) return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center text-green-800">
            <span>Đã áp dụng mã <strong>{coupon.code}</strong> (-{coupon.percent}%)</span>
            <button onClick={removeCoupon} className="text-red-500 font-bold text-sm hover:underline">Gỡ bỏ</button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-3 dark:text-white">Mã giảm giá</h3>
            <div className="flex gap-2">
                <input
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá (VD: GIAMGIA10)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                >
                    {loading ? '...' : 'Áp dụng'}
                </button>
            </div>
        </div>
    );
};

export default Cart;
