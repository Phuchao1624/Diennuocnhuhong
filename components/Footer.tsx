import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#1a2632] border-t border-[#dbe0e6] dark:border-gray-700 py-8 md:py-16 px-4 mt-6 md:mt-12 transition-colors">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[#111418] dark:text-white">
            <div className="size-8 text-primary flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-[24px] fill-current">electric_bolt</span>
            </div>
            <h2 className="font-black text-xl text-primary">
              Điện Nước <span className="text-accent">Như Hồng</span>
            </h2>
          </div>
          <p className="text-sm text-[#60758a] dark:text-gray-400 leading-relaxed">
            Đối tác tin cậy cung cấp vật tư điện nước chất lượng cao tại Việt Nam. Uy tín tạo nên thương hiệu.
          </p>
        </div>

        {/* Links: Products */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#111418] dark:text-white uppercase tracking-wider text-xs">Sản phẩm</h3>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Thiết bị điện</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Vật tư nước</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Đèn chiếu sáng</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Dụng cụ cầm tay</a>
        </div>

        {/* Links: Support */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#111418] dark:text-white uppercase tracking-wider text-xs">Hỗ trợ</h3>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Theo dõi đơn hàng</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Chính sách giao hàng</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Chính sách đổi trả</a>
          <a className="text-sm text-[#60758a] dark:text-gray-400 hover:text-primary transition-colors" href="#">Liên hệ trực tiếp</a>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#111418] dark:text-white uppercase tracking-wider text-xs">Liên hệ</h3>
          <p className="text-sm text-[#60758a] dark:text-gray-400 flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            116 đường 10 tháng 3, Tiên Kỳ, Tiên Phước, Quảng Nam
          </p>
          <p className="text-sm text-[#60758a] dark:text-gray-400 flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-primary">call</span>
            0964 413 825
          </p>
          <p className="text-sm text-[#60758a] dark:text-gray-400 flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
            nguyendinhhong11@gmail.com
          </p>
          <div className="flex gap-3 mt-4">
            <a className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1200px] mx-auto mt-8 md:mt-16 border-t border-gray-100 dark:border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <p className="text-xs text-[#60758a] dark:text-gray-500">© 2024 Điện Nước Như Hồng. Bảo lưu mọi quyền.</p>
        <div className="flex gap-4">
          <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-400 font-bold">VISA</div>
          <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-400 font-bold">MoMo</div>
          <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-400 font-bold">COD</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;