import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Contact: React.FC = () => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send to an API
        console.log('Contact form submitted:', formData);
        showToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 lg:px-0 bg-slate-50 dark:bg-[#111418]">
            <div className="flex flex-col max-w-[1600px] w-full gap-10">

                {/* Header Section */}
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-[#111418] dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                        Liên Hệ Với <span className="text-primary">Chúng Tôi</span>
                    </h1>
                    <p className="text-[#60758a] dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin hoặc ghé thăm cửa hàng của chúng tôi.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Contact Info & Map */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-8">
                        <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl shadow-sm border border-[#dbe0e6] dark:border-gray-700 flex flex-col gap-6">
                            <h3 className="text-xl font-bold text-[#111418] dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">storefront</span>
                                Thông tin cửa hàng
                            </h3>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white">Địa chỉ</h4>
                                        <p className="text-[#60758a] dark:text-gray-300 mt-1">116 đường 10 tháng 3, Thị trấn Tiên Kỳ, Huyện Tiên Phước, Tỉnh Quảng Nam</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white">Điện thoại</h4>
                                        <p className="text-[#60758a] dark:text-gray-300 mt-1">0964 413 825</p>
                                        <p className="text-sm text-gray-400 mt-1">Hỗ trợ 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white">Email</h4>
                                        <p className="text-[#60758a] dark:text-gray-300 mt-1">nguyendinhhong11@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Embedded Map */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-[#dbe0e6] dark:border-gray-700 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3837.989252684873!2d108.30162607590864!3d15.490917385106197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3169ef385fbf9199%3A0x5067b906761e65bb!2zxJBp4buHbiBOxrDhu5tjIE5oxrAgSOG7k25n!5e0!3m2!1svi!2s!4v1715413200000!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps"
                                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                            ></iframe>
                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm pointer-events-none">
                                Nhấn Ctrl + Lăn chuột để zoom
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl shadow-sm border border-[#dbe0e6] dark:border-gray-700 h-full">
                            <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-6">Gửi tin nhắn cho chúng tôi</h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#111418] dark:text-white">Họ và tên</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn A"
                                            className="h-12 w-full rounded-xl bg-[#f0f2f5] dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#111418] dark:text-white">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="09xx xxx xxx"
                                            className="h-12 w-full rounded-xl bg-[#f0f2f5] dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#111418] dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@gmail.com"
                                        className="h-12 w-full rounded-xl bg-[#f0f2f5] dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#111418] dark:text-white">Nội dung tin nhắn</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Bạn cần tư vấn về sản phẩm nào?"
                                        className="w-full rounded-xl bg-[#f0f2f5] dark:bg-[#253240] p-4 text-[#111418] dark:text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-2 h-12 w-full md:w-auto md:px-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95 self-start"
                                >
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
