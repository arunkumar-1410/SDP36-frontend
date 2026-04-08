import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!agreed) {
      setError('Please agree to terms.');
      return;
    }

    setLoading(true);

    try {
      await signup(name.trim(), email, password);
      // Registration successful! Proceed to login.
      navigate('/login', { state: { message: 'Account created! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[25%] h-[25%] bg-purple-100 rounded-full blur-3xl opacity-40"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <span className="text-white font-black text-xl">HW</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Join HealthWell</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Create student account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <p className="text-rose-600 text-xs font-bold leading-tight">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                    placeholder="Min. 6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                    placeholder="Repeat"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="flex items-start gap-2.5 cursor-pointer group text-left"
              >
                <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                  agreed ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200 group-hover:border-blue-300'
                }`}>
                  {agreed && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  I agree to HealthWell <span className="text-blue-600 underline">Terms of Service</span>.
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3 pt-6 border-t border-slate-50">
            <p className="text-slate-400 text-xs font-bold">
              Already a member? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
