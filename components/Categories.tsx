import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("API did not return an array:", data);
          setCategories([]);
        }
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#111418] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
          Danh mục sản phẩm
        </h2>
        <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
        {categories.map((category) => (
          <Link
            to={`/?categoryId=${category.id}`}
            key={category.id}
            className="group flex flex-col gap-3 rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] p-4 items-center hover:shadow-xl hover:border-primary transition-all duration-300"
          >
            <div className="text-primary p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[40px]">{category.icon}</span>
            </div>
            <h2 className="text-[#111418] dark:text-white text-base font-bold leading-tight text-center">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;