import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setStatus('error');
            return;
        }

        setStatus('loading');
        try {
            const res = await apiClient.post('/api/auth/reset-password', { token, newPassword: password });
            setMessage(res.data.message);
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to reset password');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-3">New Password</h2>
                    <p className="text-slate-500 mb-8 font-medium">Create a secure password for your account.</p>

                    {status === 'success' ? (
                        <div className="py-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Password Reset!</h3>
                            <p className="text-slate-500">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-slate-300 hover:text-slate-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {status === 'error' && <p className="text-rose-500 text-xs font-bold pl-1">{message}</p>}
                            
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Saving...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
