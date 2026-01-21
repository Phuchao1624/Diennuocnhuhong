import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ACTUAL_HERO_IMAGES = [
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwx2APMlApMvcHiheowvQdOVACOQRsF-y4fT39_OrvjEFzgNcsqUx1IE_SYfc68inw7jQkUmmhBwToVI1gRiOed0aaL6q7WW0JFMRboYBEg2FjGMmamtc04QpxLE5DiHRGtVrPxDdzz3t71=w397-h298-k-no",
  "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=0&panoid=uQ4Yvf4Nt0kh28tapOOfXA&yaw=88.416824"
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ACTUAL_HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ACTUAL_HERO_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? ACTUAL_HERO_IMAGES.length - 1 : prev - 1));
  };

  return (
    <div className="@container">
      <div className="flex flex-col gap-6 px-4 md:px-0 py-4 md:py-8 lg:gap-12 lg:px-20 lg:py-12 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-gray-700 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col gap-4 md:gap-8 flex-1">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111418] dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                Điện Nước <span className="text-primary">Như Hồng</span>
              </h1>
              <h2 className="text-[#111418] dark:text-white text-lg md:text-xl font-bold leading-tight tracking-[-0.015em]">
                Chuyên cung cấp thiết bị điện nước chính hãng, uy tín tại Quảng Nam
              </h2>
            </div>
            <p className="text-[#60758a] dark:text-gray-300 text-sm md:text-base font-normal leading-normal">
              Giảm giá đặc biệt cho các đơn hàng lớn. Miễn phí vận chuyển trong bán kính 10km. Bảo hành chính hãng 1 đổi 1.
            </p>
            <div className="flex gap-3">
              <Link to="/?q=" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors">
                <span className="truncate">Mua ngay</span>
              </Link>
              <Link to="/contact" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f5] dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="truncate">Liên hệ</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 aspect-video relative rounded-xl overflow-hidden group">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out transform hover:scale-105"
              style={{ backgroundImage: `url(${ACTUAL_HERO_IMAGES[currentImageIndex]})` }}
            ></div>

            {/* Overlay Gradient for text readability if needed, though mostly for style here */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {ACTUAL_HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;