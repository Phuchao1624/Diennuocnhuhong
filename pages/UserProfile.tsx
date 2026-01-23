import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address } from '../types';

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', phone: '', detail: '', isDefault: false });

    React.useEffect(() => {
        if (user) fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('/api/user/addresses', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setAddresses(await res.json());
        } catch (error) { console.error(error); }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newAddress)
            });
            if (res.ok) {
                showToast('Thêm địa chỉ thành công', 'success');
                setNewAddress({ name: '', phone: '', detail: '', isDefault: false });
                setShowAddAddress(false);
                fetchAddresses();
            } else {
                showToast('Thêm thất bại', 'error');
            }
        } catch (error) { showToast('Lỗi kết nối', 'error'); }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                showToast('Đã xóa địa chỉ', 'success');
                fetchAddresses();
            }
        } catch (error) { showToast('Lỗi kết nối', 'error'); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, currentPassword, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Cập nhật thành công!', 'success');
                setNewPassword('');
                setCurrentPassword('');
            } else {
                showToast(data.error || 'Cập nhật thất bại', 'error');
            }
        } catch (error) {
            showToast('Lỗi kết nối', 'error');
        }
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4">
            <div className="max-w-[600px] w-full bg-white dark:bg-[#1a2632] p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Hồ sơ cá nhân</h1>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input value={user?.email} disabled className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 rounded-md border-gray-300 shadow-sm p-2 border opacity-70" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ tên</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h3 className="font-bold mb-2 text-sm uppercase text-gray-500">Đổi mật khẩu (Nếu cần)</h3>
                        <div className="flex flex-col gap-3">
                            <input
                                type="password"
                                placeholder="Mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu mới"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h3 className="font-bold mb-4 text-sm uppercase text-gray-500 flex justify-between items-center">
                            Sổ địa chỉ
                            <button type="button" onClick={() => setShowAddAddress(!showAddAddress)} className="text-primary text-xs hover:underline">+ Thêm mới</button>
                        </h3>

                        {showAddAddress && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input placeholder="Tên gợi nhớ (Nhà, Cty)" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                                    <input placeholder="Số điện thoại" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <input placeholder="Địa chỉ chi tiết" value={newAddress.detail} onChange={e => setNewAddress({ ...newAddress, detail: e.target.value })} className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600" />
                                <div className="flex items-center gap-2 mb-3">
                                    <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })} />
                                    <span className="text-sm dark:text-gray-300">Đặt làm mặc định</span>
                                </div>
                                <button type="button" onClick={handleAddAddress} className="bg-primary text-white px-4 py-1.5 rounded text-sm font-bold">Lưu địa chỉ</button>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            {addresses.map(addr => (
                                <div key={addr.id} className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg relative group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold dark:text-white">{addr.name}</span>
                                                {addr.isDefault && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Mặc định</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{addr.phone}</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-300">{addr.detail}</p>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {addresses.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có địa chỉ nào.</p>}
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition">
                        Lưu thay đổi
                    </button>
                    {(user?.role === 'ADMIN') && (
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            Bạn đang là Quản trị viên của hệ thống.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
