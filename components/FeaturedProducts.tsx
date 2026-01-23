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
    const params = new URLSearchParams(searchParams);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) return (
    <div className="flex justify-center p-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[#111418] dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-[-0.015em] relative inline-block">
          {q ? `Kết quả tìm kiếm cho "${q}"` : 'Sản phẩm nổi bật'}
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
        </h2>
        {!q && !categoryId && (
          <Link to="/?categoryId=0" className="text-primary font-bold hover:underline flex items-center gap-1">
            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}
      </div>

      {!products.length && <p className="text-center text-gray-500 py-10">Không tìm thấy sản phẩm nào phù hợp.</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            to={product.price === 0 ? "/contact" : `/product/${product.id}`}
            key={product.id}
            className="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a2632] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 h-full"
          >
            <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-center">
              <img
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110"
                src={product.image || 'https://via.placeholder.com/300'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=No+Image';
                }}
              />
              {product.discount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  -{product.discount}%
                </div>
              )}

              <button className="absolute bottom-3 right-3 size-10 rounded-full bg-white dark:bg-[#253240] shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="material-symbols-outlined">add_shopping_cart</span>
              </button>
            </div>

            <div className="flex flex-col p-4 gap-2 flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {product.categoryId === 3 ? 'MPE' : product.categoryId === 2 ? 'Ống nước' : 'Điện dân dụng'}
                </span>
              </div>

              <h3 className="text-[#111418] dark:text-white text-sm font-bold leading-snug line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              <div className="mt-auto flex flex-col gap-1">
                <div className="flex items-center gap-1 text-yellow-500 text-[12px]">
                  <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount})</span>
                </div>

                <div className="flex items-baseline flex-wrap gap-x-2">
                  {product.price === 0 ? (
                    <span className="text-lg font-black text-primary hover:underline">Liên hệ</span>
                  ) : (
                    <>
                      <span className="text-lg font-black text-primary">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;