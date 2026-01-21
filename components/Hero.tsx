import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="@container">
      <div className="flex flex-col gap-4 md:gap-6 rounded-2xl overflow-hidden bg-white dark:bg-[#1a2632] shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-4 md:p-12 @[864px]:flex-row items-center transition-colors">
        <div
          className="w-full aspect-video rounded-xl @[864px]:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPm7MZuOdqFPffLkkI-E1y5zG3Miv0ar3iV_xfTccvmvhU7yTVJAZ8cJoGXfU7RbKGcwQbu17GtY87VVoJgX8u23amjUx1J-E02a2mqbAqgqyorK1FIs0H8WXNWl3IanBgHK50lLxF3vTlZtyzs5i8FFULzWY-2w2Ca3zRSM0B1VAUrgFE4klKxyXnK3PW7K9HRBuFZh2WmwH5T3WT3Apmsl9aIZG6_q9K9Jf6X6AmDMbyJJfoYtNiRi1RoGwnCPtJJT7cHkaN5Us")',
          }}
          aria-label="Modern electrical tools and blueprints on a table"
        />
        <div className="flex flex-col gap-6 @[864px]:w-1/2 @[864px]:pl-10 justify-center">
          <div className="flex flex-col gap-3 text-left">
            <span className="text-accent font-bold tracking-widest text-xs uppercase bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full w-fit">
              Ưu đãi mùa sửa sang
            </span>
            <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl lg:text-6xl font-black leading-[1.1] tracking-[-0.03em]">
              Điện Nước Như Hồng <br />
              <span className="text-primary">Chuyên Nghiệp</span>
            </h1>
            <p className="text-[#60758a] dark:text-gray-300 text-base md:text-lg font-normal leading-relaxed">
              Giảm giá lên đến <span className="text-accent font-bold text-xl">40%</span> cho các dòng ống nhựa PVC & Thiết bị điện dân dụng. Chất lượng hàng đầu cho ngôi nhà của bạn.
            </p>
          </div>
          <button className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-10 bg-accent hover:bg-orange-600 transition-all transform hover:scale-105 text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-orange-500/30">
            <span className="truncate">Mua Sắm Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;