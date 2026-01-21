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
        <div className="flex flex-col items-center justify-center min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#111418]">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-16">

                {/* Header Section */}
                <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
                    <h1 className="text-[#111418] dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                        Liên Hệ <span className="text-primary relative inline-block">
                            Chúng Tôi
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/20 -rotate-2 rounded-full"></span>
                        </span>
                    </h1>
                    <p className="text-[#60758a] dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Mọi thắc mắc và góp ý đều là động lực để chúng tôi phát triển.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Contact Info & Map - Takes 5 columns on large screens */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#1a2632] p-6 md:p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 h-full">
                            <h3 className="text-lg md:text-xl font-bold text-[#111418] dark:text-white flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">storefront</span>
                                </div>
                                Thông tin liên hệ
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white text-sm uppercase tracking-wide">Địa chỉ</h4>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base leading-relaxed">
                                            116 đường 10 tháng 3, Thị trấn Tiên Kỳ,<br />Huyện Tiên Phước, Tỉnh Quảng Nam
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">call</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white text-sm uppercase tracking-wide">Điện thoại</h4>
                                        <a href="tel:0964413825" className="block text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base hover:text-primary font-medium transition-colors">
                                            0964 413 825
                                        </a>
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            • Hỗ trợ 24/7
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111418] dark:text-white text-sm uppercase tracking-wide">Email</h4>
                                        <a href="mailto:nguyendinhhong11@gmail.com" className="block text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none">
                                            nguyendinhhong11@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="aspect-[16/9] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3837.989252684873!2d108.30162607590864!3d15.490917385106197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3169ef385fbf9199%3A0x5067b906761e65bb!2zxJBp4buHbiBOxrDhu5tjIE5oxrAgSOG7k25n!5e0!3m2!1svi!2s!4v1715413200000!5m2!1svi!2s"
                                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form - Takes 7 columns on large screens */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-[#1a2632] p-6 md:p-10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 h-full">
                            <h3 className="text-xl md:text-2xl font-bold text-[#111418] dark:text-white mb-2">Gửi tin nhắn</h3>
                            <p className="text-gray-500 text-sm mb-8">Điền vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24h.</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-[#111418] dark:text-white">Họ và tên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="VD: Nguyễn Văn A"
                                            className="h-12 w-full rounded-xl bg-gray-50 dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#253240] focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-[#111418] dark:text-white">Số điện thoại <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="VD: 09xx xxx xxx"
                                            className="h-12 w-full rounded-xl bg-gray-50 dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#253240] focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-[#111418] dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="VD: example@email.com"
                                        className="h-12 w-full rounded-xl bg-gray-50 dark:bg-[#253240] px-4 text-[#111418] dark:text-white placeholder-gray-400 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#253240] focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-[#111418] dark:text-white">Nội dung <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Bạn cần tư vấn về sản phẩm nào?"
                                        className="w-full rounded-xl bg-gray-50 dark:bg-[#253240] p-4 text-[#111418] dark:text-white placeholder-gray-400 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#253240] focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="h-12 w-full sm:w-auto px-8 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>Gửi tin nhắn</span>
                                        <span className="material-symbols-outlined text-lg">send</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
