import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ProductFilterProps {
    className?: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ className }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
    const [rating, setRating] = useState(0);
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        // Sync local state from URL
        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');
        const r = searchParams.get('rating');
        const s = searchParams.get('sort');

        if (min) setPriceRange(prev => ({ ...prev, min: Number(min) }));
        if (max) setPriceRange(prev => ({ ...prev, max: Number(max) }));
        if (r) setRating(Number(r));
        if (s) setSort(s);
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);
        if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
        else params.delete('minPrice');

        if (priceRange.max < 5000000) params.set('maxPrice', priceRange.max.toString());
        else params.delete('maxPrice');

        if (rating > 0) params.set('rating', rating.toString());
        else params.delete('rating');

        if (sort !== 'newest') params.set('sort', sort);
        else params.delete('sort');

        setSearchParams(params);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const val = Number(e.target.value);
        setPriceRange(prev => ({ ...prev, [type]: val }));
    };

    return (
        <div className={`flex flex-col gap-6 bg-white dark:bg-[#1a2632] p-5 rounded-xl text-[#111418] dark:text-gray-200 border border-[#dbe0e6] dark:border-gray-700 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Bộ lọc</h3>
                <button
                    onClick={() => setSearchParams({})}
                    className="text-primary text-sm font-medium hover:underline"
                >
                    Xóa tất cả
                </button>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Sắp xếp theo</label>
                <select
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        // Apply immediately for sort
                        const params = new URLSearchParams(searchParams);
                        params.set('sort', e.target.value);
                        setSearchParams(params);
                    }}
                    className="p-2 rounded border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 outline-none focus:border-primary"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh giá cao</option>
                </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-3">
                <label className="font-bold text-sm">Khoảng giá</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="0"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Max"
                    />
                </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-3">
                <label className="font-bold text-sm">Đánh giá</label>
                <div className="flex flex-col gap-2">
                    {[5, 4, 3].map(star => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                            <input
                                type="radio"
                                name="rating"
                                checked={rating === star}
                                onChange={() => setRating(star)}
                                className="accent-primary"
                            />
                            <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-[18px] outline-none select-none">
                                        {i < star ? 'star' : 'star_outline'}
                                    </span>
                                ))}
                                <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">trở lên</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={applyFilters}
                className="bg-primary text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Áp dụng
            </button>
        </div>
    );
};

export default ProductFilter;
