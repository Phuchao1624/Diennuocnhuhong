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
    <div className="w-full bg-white dark:bg-[#1a2632] py-4 md:py-8 transition-colors">
      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center w-full">
          <div className="flex flex-col gap-4 md:gap-6 flex-1 w-full lg:w-1/2">
            <div className="flex flex-col gap-2 text-center lg:text-left">
              <span className="text-accent font-bold tracking-widest text-[10px] md:text-xs uppercase bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full w-fit mx-auto lg:mx-0">
                Ưu đãi mùa sửa sang
              </span>
              <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                Điện Nước <span className="text-primary">Như Hồng</span>
              </h1>
              <h2 className="text-[#111418] dark:text-white text-base md:text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em]">
                Chuyên cung cấp thiết bị điện nước chính hãng, uy tín tại Quảng Nam
              </h2>
            </div>
            <p className="text-[#60758a] dark:text-gray-300 text-sm md:text-base font-normal leading-relaxed text-center lg:text-left">
              Giảm giá đặc biệt cho các đơn hàng lớn. Miễn phí vận chuyển trong bán kính 10km. Bảo hành chính hãng 1 đổi 1.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start">
              <Link to="/?q=" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                <span className="truncate">Mua ngay</span>
              </Link>
              <Link to="/contact" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="truncate">Liên hệ</span>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-video relative rounded-2xl overflow-hidden group shadow-2xl shadow-gray-200/50 dark:shadow-none">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out transform hover:scale-105"
              style={{ backgroundImage: `url(${ACTUAL_HERO_IMAGES[currentImageIndex]})` }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

            <button
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {ACTUAL_HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`}
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