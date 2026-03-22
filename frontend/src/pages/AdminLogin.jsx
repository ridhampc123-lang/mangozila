import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import { setToken } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { reloadUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Enter email and password');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/admin-login', { email, password });
            setToken(data.token);
            await reloadUser();
            toast.success(`Welcome, ${data.user.name}! 🥭`);
            navigate('/admin');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <p className="text-6xl mb-3">🥭</p>
                    <h1 className="font-display text-3xl font-bold text-stone-100">MangoZila Admin</h1>
                    <p className="text-stone-400 mt-1 text-sm">Sign in to manage your platform</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-xs text-stone-400 mb-1.5 block font-medium">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@mangozila.com"
                                    className="input-field pl-10"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-stone-400 mb-1.5 block font-medium">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field pl-10 pr-10"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                                >
                                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-base"
                        >
                            {loading ? 'Signing in...' : '🔐 Sign In to Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-5 p-3 bg-stone-800/60 rounded-xl text-xs text-stone-500 text-center">
                        Admin access only. Customers don't need to login.
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
