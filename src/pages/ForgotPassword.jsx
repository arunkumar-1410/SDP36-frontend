import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await apiClient.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setStatus('success');
        } catch (err) {
            setMessage('Failed to send reset link. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-bold text-sm transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>

                    <h2 className="text-3xl font-black text-slate-900 mb-3">Recover Password</h2>
                    <p className="text-slate-500 mb-8 font-medium">Enter your email and we'll send you a recovery link.</p>

                    {status === 'success' ? (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Check your email</h3>
                            <p className="text-slate-500">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        placeholder="jordan@university.edu"
                                    />
                                </div>
                            </div>
                            {status === 'error' && <p className="text-rose-500 text-xs font-bold pl-1">{message}</p>}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
