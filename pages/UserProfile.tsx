import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
