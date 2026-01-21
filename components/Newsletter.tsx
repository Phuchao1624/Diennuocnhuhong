import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setMessage('Đăng ký thành công!');
        setEmail('');
      } else {
        const err = await res.json();
        setMessage('Lỗi: ' + (err.error || 'Thất bại'));
      }
    } catch (error) {
      setMessage('Lỗi kết nối');
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-900 via-primary to-blue-700 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-black">Ưu đãi cho Thợ & Công trình</h2>
        <p className="text-blue-100 opacity-90 max-w-lg text-lg">
          Nhận mức chiết khấu riêng dành cho nhà thầu và khách hàng mua số lượng lớn. Đăng ký tài khoản doanh nghiệp ngay!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="flex flex-col">
          <input
            className="rounded-lg border-none px-6 py-4 text-[#111418] w-full md:w-80 focus:ring-4 focus:ring-accent/50 outline-none"
            placeholder="Nhập email của bạn"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <span className="text-sm mt-1 ml-1 text-white/90 font-bold">{message}</span>}
        </div>
        <button
          onClick={handleSubscribe}
          className="bg-accent hover:bg-orange-600 text-white font-black py-4 px-10 rounded-lg transition-all whitespace-nowrap shadow-lg hover:shadow-orange-500/40 h-fit"
        >
          Đăng Ký
        </button>
      </div>
    </div>
  );
};

export default Newsletter;