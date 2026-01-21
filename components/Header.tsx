import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/?q=${searchTerm}`);
    }
  };

  return (
    <header className="flex flex-col bg-white dark:bg-[#1a2632] shadow-sm sticky top-0 z-50 transition-colors">
      <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] dark:border-b-gray-700 px-4 lg:px-10 py-4">
        <div className="flex items-center gap-4 lg:gap-12 w-full max-w-[1200px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 lg:gap-3 text-[#111418] dark:text-white shrink-0 cursor-pointer">
            <div className="size-10 text-primary flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-[32px] fill-current">electric_bolt</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black leading-tight tracking-tight text-primary">
              Điện Nước <span className="text-accent">Như Hồng</span>
            </h1>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <label className="flex flex-col min-w-0 flex-1 max-w-[600px] mx-auto hidden md:flex">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-11 ring-1 ring-[#dbe0e6] dark:ring-gray-600 focus-within:ring-2 focus-within:ring-primary overflow-hidden">
              <div className="text-[#60758a] dark:text-gray-400 flex border-none bg-[#f0f2f5] dark:bg-[#253240] items-center justify-center pl-4">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111418] dark:text-white focus:outline-0 border-none bg-[#f0f2f5] dark:bg-[#253240] placeholder:text-[#60758a] dark:placeholder:text-gray-500 px-3 text-sm font-normal leading-normal"
                placeholder="Tìm kiếm bóng đèn, dây điện, ống nước..."
              />
            </div>
          </label>

          {/* Action Icons */}
          <div className="flex gap-2 shrink-0 items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#111418] dark:text-white hidden sm:block">Chào, {user.name}</span>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-xs font-bold text-red-600 hover:underline">Quản trị</Link>
                )}
                <Link to="/profile" className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:underline">Hồ sơ</Link>
                <Link to="/wishlist" className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:underline">Yêu thích</Link>
                <Link to="/orders" className="text-xs font-bold text-primary hover:underline">Đơn hàng</Link>
                <button
                  onClick={logout}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-bold py-2 px-3 rounded text-[#111418] dark:text-white"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center justify-center rounded-lg size-10 bg-transparent hover:bg-[#f0f2f5] dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors">
                <span className="material-symbols-outlined">person</span>
              </Link>
            )}

            <Link to="/cart" className="flex items-center justify-center rounded-lg size-10 bg-transparent hover:bg-[#f0f2f5] dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 size-2 bg-accent rounded-full animate-pulse"></span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg size-10 bg-transparent hover:bg-[#f0f2f5] dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] px-4 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <div className="flex w-full items-stretch rounded-lg h-11 ring-1 ring-[#dbe0e6] dark:ring-gray-600 focus-within:ring-2 focus-within:ring-primary overflow-hidden">
            <div className="text-[#60758a] dark:text-gray-400 flex border-none bg-[#f0f2f5] dark:bg-[#253240] items-center justify-center pl-4">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/?q=${searchTerm}`);
                  setIsMenuOpen(false);
                }
              }}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111418] dark:text-white focus:outline-0 border-none bg-[#f0f2f5] dark:bg-[#253240] placeholder:text-[#60758a] dark:placeholder:text-gray-500 px-3 text-sm font-normal leading-normal"
              placeholder="Tìm sản phẩm..."
            />
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase">Danh mục</p>
            {MENU_ITEMS.map((item, index) => {
              const catId = item === "Tất cả" ? 0 : index;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    navigate(catId === 0 ? '/' : `/?categoryId=${catId}`);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left py-2 font-medium ${activeTab === item ? 'text-primary' : 'text-[#111418] dark:text-gray-200'}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="hidden md:block border-b border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632]">
        <div className="flex justify-center px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-8 max-w-[1200px] w-full">
            {MENU_ITEMS.map((item, index) => {
              const catId = item === "Tất cả" ? 0 : index;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    navigate(catId === 0 ? '/' : `/?categoryId=${catId}`);
                  }}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 shrink-0 transition-colors ${activeTab === item
                    ? 'border-b-primary text-primary'
                    : 'border-b-transparent text-[#60758a] dark:text-gray-400 hover:text-primary'
                    }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-wide uppercase">{item}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;