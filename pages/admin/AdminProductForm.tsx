import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const AdminProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        unit: 'cái',
        originalPrice: '',
        discount: '0',
        categoryId: '1'
    });

    useEffect(() => {
        if (id) {
            fetch(`/api/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name,
                        price: data.price.toString(),
                        image: data.image,
                        unit: data.unit || 'cái',
                        originalPrice: data.originalPrice ? data.originalPrice.toString() : '',
                        discount: data.discount ? data.discount.toString() : '0',
                        categoryId: data.categoryId ? data.categoryId.toString() : '1'
                    });
                })
                .catch(console.error);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = id
                ? `/api/products/${id}`
                : '/api/products';
            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                    discount: parseInt(formData.discount),
                    categoryId: parseInt(formData.categoryId)
                })
            });
            if (res.ok) {
                showToast(id ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!', 'success');
                navigate('/admin/products');
            } else {
                showToast('Lỗi khi lưu sản phẩm', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Lỗi kết nối', 'error');
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[600px] w-full bg-white dark:bg-[#1a2632] p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">{id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên sản phẩm</label>
                        <input name="name" value={formData.name} required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá bán (VNĐ)</label>
                        <input name="price" value={formData.price} type="number" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá gốc (VNĐ) (Tùy chọn)</label>
                        <input name="originalPrice" value={formData.originalPrice} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giảm giá (%)</label>
                        <input name="discount" value={formData.discount} type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đơn vị tính</label>
                        <input name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Hình ảnh</label>
                        <input name="image" value={formData.image} required onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition">
                        {id ? 'Cập nhật' : 'Lưu sản phẩm'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProductForm;
