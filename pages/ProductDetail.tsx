import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ReviewSection from '../components/ReviewSection';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        if (!id) return;
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setProduct(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            showToast('Đã thêm vào giỏ hàng!', 'success');
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;
    if (!product) return <div className="p-10 text-center">Sản phẩm không tồn tại</div>;

    return (
        <div className="flex flex-1 justify-center py-8 px-4 lg:px-0">
            <div className="flex flex-col max-w-[1600px] flex-1 w-full gap-12">

                {/* Top Section: Image & Basic Info */}
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-7/12 bg-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-8 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full max-h-[300px] md:max-h-[500px] object-contain" />
                    </div>
                    <div className="w-full md:w-5/12 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            {product.categoryId && <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Danh mục {product.categoryId}</span>}
                            <h1 className="text-3xl md:text-4xl font-black text-[#111418] dark:text-white leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                <span className="material-symbols-outlined fill-current text-lg">star</span>
                                <span className="font-bold text-lg">{product.rating}</span>
                                <span className="text-gray-400">({product.reviewCount} đánh giá)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3 border-b border-gray-100 dark:border-gray-700 pb-6">
                            <span className="text-4xl font-black text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
                            {product.originalPrice && <span className="text-gray-400 line-through text-xl">{product.originalPrice.toLocaleString('vi-VN')}đ</span>}
                            {product.discount && <span className="bg-red-50 text-red-600 px-2 py-1 rounded font-bold">-{product.discount}%</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                                <span>Còn hàng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                <span>Giao hàng toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                <span>Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">replay</span>
                                <span>Đổi trả trong 7 ngày</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="bg-accent hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                        >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-6 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 inline-block">Mô tả sản phẩm</h3>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>
                            Sản phẩm <strong>{product.name}</strong> là lựa chọn hàng đầu cho công trình của bạn.
                            Được sản xuất trên dây chuyền công nghệ hiện đại, đảm bảo độ bền cao và an toàn tuyệt đối khi sử dụng.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>Thương hiệu uy tín, chất lượng đảm bảo.</li>
                            <li>Thiết kế hiện đại, dễ dàng lắp đặt và sử dụng.</li>
                            <li>Độ bền cao, chịu được điều kiện môi trường khắc nghiệt.</li>
                            <li>Giá thành hợp lý, phù hợp với mọi nhu cầu.</li>
                        </ul>
                        <p className="mt-4">
                            Liên hệ ngay với chúng tôi để được tư vấn chi tiết và nhận ưu đãi tốt nhất.
                        </p>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewSection
                    productId={product.id}
                    reviews={(product as any).reviews || []}
                    onReviewAdded={() => {
                        fetch(`/api/products/${product.id}`)
                            .then(res => res.json())
                            .then(data => setProduct(data));
                    }}
                />
            </div>
        </div>
    );
};

export default ProductDetail;
