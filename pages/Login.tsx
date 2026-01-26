import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await loginWithEmail(email, password);
            showToast('Đăng nhập thành công!', 'success');
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to login');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            showToast('Đăng nhập Google thành công!', 'success');
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to login with Google');
        }
    };

    return (
        <div className="flex flex-1 justify-center items-center py-20 px-4 bg-gray-50 dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-[#1a2632] rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#111418] dark:text-white">Đăng Nhập</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-2">
                        Đăng Nhập
                    </button>
                    <button type="button" onClick={handleGoogleLogin} className="w-full bg-white text-gray-700 border border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors mt-2 flex justify-center items-center gap-2">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Đăng nhập bằng Google
                    </button>
                </form>
                <p className="mt-4 text-center text-sm dark:text-gray-400">
                    Chưa có tài khoản? <a href="/register" className="text-primary hover:underline">Đăng ký ngay</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
