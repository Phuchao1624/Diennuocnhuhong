import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    address: string;
    user: { name: string; email: string };
    items: OrderItem[];
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            }
        } catch (error) {
            alert('Cập nhật thất bại');
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải đơn hàng...</div>;

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                <h1 className="text-3xl font-bold dark:text-white">Quản lý Đơn hàng</h1>
                <div className="flex flex-col gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b pb-4 gap-4">
                                <div>
                                    <p className="font-bold text-lg dark:text-white">Đơn hàng #{order.id} - {order.user.name}</p>
                                    <p className="text-sm text-gray-500">{order.user.email}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                                    <p className="text-sm font-medium mt-1">Giao đến: {order.address}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="PENDING">Đang xử lý</option>
                                        <option value="PROCESSING">Đang chuẩn bị hàng</option>
                                        <option value="SHIPPED">Đang giao hàng</option>
                                        <option value="DELIVERED">Đã giao thành công</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </select>
                                    <p className="font-bold text-primary text-xl">{order.total.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 text-sm">
                                        <span className="font-bold text-gray-500">{item.quantity}x</span>
                                        <span className="flex-1 dark:text-gray-300">{item.product.name}</span>
                                        <span className="text-gray-500">{item.price.toLocaleString('vi-VN')}đ</span>
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

export default AdminOrders;
