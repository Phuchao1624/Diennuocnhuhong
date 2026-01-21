import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useToast } from '../context/ToastContext';

const Checkout: React.FC = () => {
    const { cart, total, finalTotal, coupon, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    if (cart.length === 0) return <div className="p-10 text-center">Giỏ hàng trống</div>;
    if (!user) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <h2 className="text-xl font-bold dark:text-white">Vui lòng đăng nhập để thanh toán</h2>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Đăng nhập ngay</button>
        </div>
    );

    const handleOrder = async () => {
        if (!address) return showToast('Vui lòng nhập địa chỉ', 'error');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
                    total: finalTotal,
                    address
                })
            });
            if (res.ok) {
                showToast('Đặt hàng thành công!', 'success');
                clearCart();
                navigate('/');
            } else {
                showToast('Đặt hàng thất bại', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[800px] w-full flex flex-col gap-8">
                <h1 className="text-3xl font-bold dark:text-white">Thanh Toán</h1>

                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Thông tin giao hàng</h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Họ tên</label>
                            <input disabled value={user.name} className="w-full px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                            <input disabled value={user.email} className="w-full px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Địa chỉ nhận hàng (*)</label>
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                                placeholder="Số nhà, đường, phường/xã..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Tóm tắt đơn hàng</h3>
                    <div className="border-t pt-4 flex flex-col gap-2">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex justify-between text-sm dark:text-gray-300">
                                <span>{item.quantity}x {item.product.name}</span>
                                <span>{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                        <div className="flex justify-between text-gray-500">
                            <span>Tạm tính</span>
                            <span>{total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {coupon && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Giảm giá ({coupon.code})</span>
                                <span>-{((total * coupon.percent) / 100).toLocaleString('vi-VN')}đ</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl text-primary mt-2">
                            <span>Tổng cộng</span>
                            <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
