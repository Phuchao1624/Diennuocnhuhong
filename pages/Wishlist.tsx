import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/wishlist', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data.map((item: any) => item.product));
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const removeFromWishlist = async (productId: number) => {
        try {
            await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId })
            });
            setProducts(products.filter(p => p.id !== productId));
        } catch (error) {
            alert('Lỗi');
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[1200px] w-full">
                <h1 className="text-3xl font-bold mb-8 dark:text-white">Sản phẩm yêu thích ({products.length})</h1>
                {products.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">Danh sách yêu thích đang trống</p>
                        <Link to="/" className="text-primary font-bold hover:underline">Khám phá sản phẩm ngay</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="flex flex-col gap-3 pb-3 relative group">
                                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl bg-white relative" style={{ backgroundImage: `url(${product.image})` }}>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                                    >
                                        <span className="material-symbols-outlined fill-current">favorite</span>
                                    </button>
                                </div>
                                <div>
                                    <p className="text-[#111418] text-base font-medium leading-normal dark:text-white line-clamp-2 min-h-[48px]">{product.name}</p>
                                    <p className="text-[#111418] text-lg font-bold leading-normal dark:text-gray-300">{product.price.toLocaleString('vi-VN')}đ</p>
                                </div>
                                <Link to={`/product/${product.id}`} className="bg-[#f0f2f5] dark:bg-gray-700 text-[#111418] dark:text-white h-10 px-5 rounded-xl font-bold text-sm tracking-[0.015em] hover:bg-[#e0e2e5] dark:hover:bg-gray-600 transition-colors flex items-center justify-center">
                                    Xem chi tiết
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
