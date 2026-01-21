import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Xóa thất bại');
            }
        } catch (error) {
            alert('Lỗi kết nối');
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1200px] w-full flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold dark:text-white">Quản lý Sản phẩm</h1>
                    <Link to="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
                        + Thêm mới
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Tên</th>
                                <th className="p-4">Giá</th>
                                <th className="p-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="p-4">#{p.id}</td>
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={p.image} className="w-10 h-10 object-contain bg-white rounded" />
                                        {p.name}
                                    </td>
                                    <td className="p-4">{p.price.toLocaleString('vi-VN')}đ</td>
                                    <td className="p-4 flex gap-4">
                                        <Link to={`/admin/products/edit/${p.id}`} className="text-blue-500 hover:text-blue-700 font-bold">Sửa</Link>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-bold">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
