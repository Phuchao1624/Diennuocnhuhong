import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1200px] w-full">
                <h1 className="text-3xl font-bold mb-8 dark:text-white">Tổng quan Quản trị</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-sm opacity-80 mb-1">Doanh thu</p>
                        <p className="text-3xl font-bold">{(stats?.revenue || 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-sm opacity-80 mb-1">Đơn hàng</p>
                        <p className="text-3xl font-bold">{stats?.orders || 0}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-sm opacity-80 mb-1">Sản phẩm</p>
                        <p className="text-3xl font-bold">{stats?.products || 0}</p>
                    </div>
                    <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
                        <p className="text-sm opacity-80 mb-1">Khách hàng</p>
                        <p className="text-3xl font-bold">{stats?.users || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Actions */}
                    <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Quản lý nhanh</h2>
                        <div className="flex flex-col gap-4">
                            <Link to="/admin/products" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-between dark:bg-gray-800 dark:text-white">
                                <span>📦 Quản lý Sản phẩm</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <Link to="/admin/orders" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-between dark:bg-gray-800 dark:text-white">
                                <span>🚚 Quản lý Đơn hàng</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <Link to="/admin/products/new" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-between dark:bg-gray-800 dark:text-white">
                                <span>➕ Thêm sản phẩm mới</span>
                                <span className="material-symbols-outlined">add_circle</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Đơn hàng mới nhất</h2>
                        <div className="flex flex-col gap-3">
                            {stats?.recentOrders.map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div>
                                        <p className="font-bold text-sm">#{order.id} - {order.user.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
