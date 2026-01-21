import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
        image: string;
    };
}

interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const OrderHistory: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCancel = async (orderId: number) => {
        if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                showToast('Đã hủy đơn hàng', 'success');
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
            } else {
                const err = await res.json();
                showToast(err.error || 'Lỗi khi hủy đơn', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        fetch('/api/orders/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [user]);

    if (loading) return <div className="p-10 text-center">Đang tải đơn hàng...</div>;
    if (!orders.length) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <h2 className="text-xl font-bold dark:text-white">Bạn chưa có đơn hàng nào</h2>
            <Link to="/" className="text-primary font-bold hover:underline">Mua sắm ngay</Link>
        </div>
    );

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1000px] w-full flex flex-col gap-8">
                <h1 className="text-3xl font-bold dark:text-white">Lịch sử đơn hàng</h1>
                <div className="flex flex-col gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-gray-600">
                                <div>
                                    <p className="font-bold text-lg dark:text-white">Đơn hàng #{order.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')} - {new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {order.status === 'PENDING' ? 'Đang xử lý' : order.status}
                                    </span>
                                    <p className="font-bold text-primary text-xl mt-1">{order.total.toLocaleString('vi-VN')}đ</p>
                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            className="text-red-500 text-sm font-bold hover:underline mt-1"
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-contain rounded bg-gray-50" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold dark:text-white line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} x {item.price.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
