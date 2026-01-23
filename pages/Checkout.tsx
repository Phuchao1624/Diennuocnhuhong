import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useToast } from '../context/ToastContext';

const Checkout: React.FC = () => {
    const { cart, total, finalTotal, coupon, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, BANKING
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            fetch('/api/user/addresses', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => {
                    setAddresses(data);
                    const defaultAddr = data.find((a: any) => a.isDefault);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                        setAddress(`${defaultAddr.name} - ${defaultAddr.phone} - ${defaultAddr.detail}`);
                    }
                })
                .catch(console.error);
        }
    }, [user]);

    const handleSelectAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setAddress(`${addr.name} - ${addr.phone} - ${addr.detail}`);
    };

    if (cart.length === 0) return <div className="p-10 text-center">Giỏ hàng trống</div>;
    if (!user) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <h2 className="text-xl font-bold dark:text-white">Vui lòng đăng nhập để thanh toán</h2>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Đăng nhập ngay</button>
        </div>
    );

    const handleOrder = async () => {
        if (!address) return showToast('Vui lòng nhập địa chỉ', 'error');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
                    total: finalTotal,
                    address,
                    paymentMethod // Include payment method in API
                })
            });
            if (res.ok) {
                showToast('Đặt hàng thành công!', 'success');
                clearCart();
                navigate('/');
            } else {
                showToast('Đặt hàng thất bại', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[800px] w-full flex flex-col gap-8">
                <h1 className="text-3xl font-bold dark:text-white">Thanh Toán</h1>

                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Thông tin giao hàng</h3>

                    {addresses.length > 0 && (
                        <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
                            {addresses.map(addr => (
                                <button
                                    key={addr.id}
                                    onClick={() => handleSelectAddress(addr)}
                                    className={`flex-shrink-0 border p-3 rounded-lg text-left min-w-[200px] hover:border-primary transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'dark:border-gray-600'}`}
                                >
                                    <p className="font-bold text-sm dark:text-white">{addr.name}</p>
                                    <p className="text-xs text-gray-500">{addr.phone}</p>
                                    <p className="text-xs truncate text-gray-700 dark:text-gray-300">{addr.detail}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Người nhận</label>
                            <input disabled value={user.name} className="w-full px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Địa chỉ nhận hàng (*)</label>
                            <textarea
                                value={address}
                                onChange={e => {
                                    setAddress(e.target.value);
                                    setSelectedAddressId(null);
                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                                placeholder="Chọn từ sổ địa chỉ hoặc nhập mới..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Phương thức thanh toán</h3>
                    <div className="flex flex-col gap-3">
                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600'}`}>
                            <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-primary size-5" />
                            <div className="flex flex-col">
                                <span className="font-bold dark:text-white">Thanh toán khi nhận hàng (COD)</span>
                                <span className="text-xs text-gray-500">Thanh toán tiền mặt cho shipper khi nhận được hàng.</span>
                            </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'BANKING' ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600'}`}>
                            <input type="radio" name="payment" value="BANKING" checked={paymentMethod === 'BANKING'} onChange={() => setPaymentMethod('BANKING')} className="accent-primary size-5" />
                            <div className="flex flex-col">
                                <span className="font-bold dark:text-white">Chuyển khoản Ngân hàng (QR Code)</span>
                                <span className="text-xs text-gray-500">Quét mã QR để chuyển khoản nhanh chóng.</span>
                            </div>
                        </label>
                    </div>

                    {paymentMethod === 'BANKING' && (
                        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg flex flex-col items-center text-center dark:bg-blue-900/20 dark:border-blue-800">
                            <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">Quét mã để thanh toán</p>
                            <img
                                src={`https://img.vietqr.io/image/MB-0964413825-print.png?amount=${finalTotal}&addInfo=THANHTOAN DONHANG ${new Date().getTime()}&accountName=NGUYEN DINH HONG`}
                                alt="VietQR"
                                className="w-48 h-48 rounded-lg shadow-sm border bg-white"
                            />
                            <p className="text-xs text-blue-600 mt-2 dark:text-blue-400">Nội dung CK: TTDH {new Date().getTime()}</p>
                            <p className="text-xs text-red-500 font-bold mt-1">Lưu ý: Chụp màn hình bill chuyển khoản để đối chiếu khi cần.</p>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Tóm tắt đơn hàng</h3>
                    <div className="border-t pt-4 flex flex-col gap-2">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex justify-between text-sm dark:text-gray-300">
                                <span>{item.quantity}x {item.product.name}</span>
                                <span>{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                        <div className="flex justify-between text-gray-500">
                            <span>Tạm tính</span>
                            <span>{total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {coupon && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Giảm giá ({coupon.code})</span>
                                <span>-{((total * coupon.percent) / 100).toLocaleString('vi-VN')}đ</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl text-primary mt-2">
                            <span>Tổng cộng</span>
                            <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
