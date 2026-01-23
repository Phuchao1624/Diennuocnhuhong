import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const HARDCODED_PRODUCTS: Product[] = [
  // MPE Products
  {
    id: 101,
    name: 'Bóng đèn LED Bulb MPE 30W LBD-30W',
    price: 155000,
    originalPrice: 185000,
    image: 'https://mpe.com.vn/uploads/products/large/lbd-30w-1.jpg',
    rating: 5,
    reviewCount: 42,
    discount: 16,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 102,
    name: 'Bóng đèn LED Bulb MPE 40W LBD-40W',
    price: 215000,
    originalPrice: 250000,
    image: 'https://mpe.com.vn/uploads/products/large/lbd-40w-1.jpg',
    rating: 4.5,
    reviewCount: 28,
    discount: 14,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 103,
    name: 'Đèn LED Downlight MPE Âm Trần 9W RPL-9T',
    price: 110000,
    originalPrice: 145000,
    image: 'https://mpe.com.vn/uploads/products/large/rpl-9t-1.jpg',
    rating: 5,
    reviewCount: 56,
    discount: 24,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 104,
    name: 'Đèn LED Panel MPE Vuông 40W FPL-6060T',
    price: 850000,
    originalPrice: 1100000,
    image: 'https://mpe.com.vn/uploads/products/large/fpl-6060t-1.jpg',
    rating: 5,
    reviewCount: 12,
    discount: 23,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 105,
    name: 'Bóng Đèn LED Tuýp Thủy Tinh MPE 22W GT8-120T',
    price: 85000,
    originalPrice: 95000,
    image: 'https://mpe.com.vn/uploads/products/large/gt8-120t-1.jpg',
    rating: 4.5,
    reviewCount: 89,
    discount: 10,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 106,
    name: 'Đèn Pha LED MPE Series FLD2 50W',
    price: 550000,
    originalPrice: 680000,
    image: 'https://mpe.com.vn/uploads/products/large/fld2-50t.jpg',
    rating: 5,
    reviewCount: 15,
    discount: 19,
    unit: 'Cái',
    categoryId: 3
  },
  {
    id: 107,
    name: 'Đèn Bán Nguyệt MPE 40W BN-40T',
    price: 240000,
    originalPrice: 290000,
    image: 'https://mpe.com.vn/uploads/products/large/bn-40t-1.jpg',
    rating: 4,
    reviewCount: 22,
    discount: 17,
    unit: 'Cái',
    categoryId: 3
  },

  // Nhua Binh Minh
  {
    id: 201,
    name: 'Ống Nhựa PVC-u Bình Minh D21 (Dày 1.6mm)',
    price: 10500,
    originalPrice: 12000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/ong-pvc-cung-he-inch-1.jpg',
    rating: 5,
    reviewCount: 120,
    discount: 12,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 202,
    name: 'Ống Nhựa PVC-u Bình Minh D27 (Dày 1.8mm)',
    price: 15000,
    originalPrice: 17000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/ong-pvc-cung-he-inch-1.jpg',
    rating: 5,
    reviewCount: 95,
    discount: 11,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 203,
    name: 'Ống Nhựa PVC-u Bình Minh D90 (Dày 2.9mm)',
    price: 110000,
    originalPrice: 125000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/ong-pvc-cung-he-inch-1.jpg',
    rating: 5,
    reviewCount: 45,
    discount: 12,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 204,
    name: 'Co 90 Độ Nhựa Bình Minh D27',
    price: 5000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/co-90-do-1.jpg',
    rating: 5,
    reviewCount: 200,
    unit: 'Cái',
    categoryId: 2
  },
  {
    id: 205,
    name: 'Tê Đều Nhựa Bình Minh D21',
    price: 4000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/te-deu-1.jpg',
    rating: 5,
    reviewCount: 180,
    unit: 'Cái',
    categoryId: 2
  },
  {
    id: 206,
    name: 'Keo Dán Ống Nhựa Bình Minh 200g',
    price: 35000,
    image: 'https://binhminhplastic.com.vn/upload/sanpham/keo-dan-ong-pvc-1.jpg',
    rating: 4.5,
    reviewCount: 60,
    unit: 'Lon',
    categoryId: 2
  },

  // Dat Hoa Products
  {
    id: 301,
    name: 'Ống HDPE Đạt Hòa D50 PN10',
    price: 45000,
    originalPrice: 50000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/ong-nhua-hdpe/ong-nhua-hdpe-dat-hoa.jpg',
    rating: 4.5,
    reviewCount: 15,
    discount: 10,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 302,
    name: 'Ống Cống Chịu Lực HDPE Đạt Hòa D300',
    price: 450000,
    originalPrice: 500000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/ong-cong-chiu-luc-hdpe/ong-cong-chiu-luc-hdpe.jpg',
    rating: 5,
    reviewCount: 8,
    discount: 10,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 303,
    name: 'Ống uPVC Đạt Hòa D114 (Dày 3.2mm)',
    price: 125000,
    originalPrice: 140000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/ong-nhua-upvc/ong-nhua-upvc.jpg',
    rating: 4,
    reviewCount: 20,
    discount: 11,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 304,
    name: 'Phụ Kiện HDPE Đạt Hòa - Nối Thẳng D50',
    price: 65000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/phu-kien-ong-nhua-hdpe/noi-thang.jpg',
    rating: 4.5,
    reviewCount: 12,
    unit: 'Cái',
    categoryId: 2
  },
  {
    id: 305,
    name: 'Van Cầu Nhựa uPVC Đạt Hòa D27',
    price: 25000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/van-cau-nhua-upvc/van-cau.jpg',
    rating: 4,
    reviewCount: 45,
    unit: 'Cái',
    categoryId: 2
  },
  {
    id: 306,
    name: 'Ống lưới dẻo PVC Đạt Hòa D16',
    price: 12000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/ong-luoi-deo-pvc/ong-luoi.jpg',
    rating: 5,
    reviewCount: 67,
    unit: 'Mét',
    categoryId: 2
  },
  {
    id: 307,
    name: 'Máng Gene Luồn Dây Điện Vuông Đạt Hòa 24x14',
    price: 18000,
    image: 'https://nhuadathoa.com.vn/uploads/san-pham/mang-gene-luon-day-dien/nep-vuong.jpg',
    rating: 4.5,
    reviewCount: 90,
    unit: 'Cây',
    categoryId: 1
  }
];

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    // Simulate loading for better UX
    setLoading(true);
    setTimeout(() => {
      let filtered = [...HARDCODED_PRODUCTS];

      if (q) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
      }

      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId === Number(categoryId));
      }

      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [q, categoryId]);

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
            to={`/product/${product.id}`}
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
                  <span className="text-lg font-black text-primary">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
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