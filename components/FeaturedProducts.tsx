import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (categoryId) params.append('categoryId', categoryId);

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API did not return an array:", data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, [q, categoryId]);

  if (loading) return <div className="text-center p-10">Đang tải sản phẩm...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[#111418] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
        {q ? `Kết quả tìm kiếm cho "${q}"` : 'Sản phẩm nổi bật'}
      </h2>
      {!products.length && <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="flex flex-col rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] overflow-hidden group hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative w-full pt-[100%] bg-gray-50 dark:bg-gray-800">
              <img
                alt={product.name}
                className="absolute top-0 left-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                src={product.image}
              />
              {product.discount && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="flex flex-col p-3 md:p-5 gap-2 md:gap-3 flex-1">
              {/* Rating */}
              <div className="flex items-center gap-1 text-yellow-400 text-[10px]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-[14px] ${i < Math.floor(product.rating || 0) ? 'fill-current' : (product.rating && i < product.rating) ? 'star_half' : 'text-gray-300'}`}>
                    {(product.rating && i < Math.floor(product.rating)) ? 'star' : (product.rating && i < product.rating) ? 'star_half' : 'star'}
                  </span>
                ))}
                <span className="text-gray-400 ml-1 text-xs">({product.reviewCount || 0})</span>
              </div>

              <h3 className="text-[#111418] dark:text-white text-sm font-semibold leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-2 mt-auto">
                <span className="text-xl font-bold text-primary">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.unit && (
                  <span className="text-xs text-gray-500">{product.unit}</span>
                )}
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              <button className="w-full py-2.5 bg-accent hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-orange-500/20 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Thêm vào giỏ
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;