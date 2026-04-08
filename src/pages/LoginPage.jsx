import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in both fields.');
        setLoading(false);
        return;
      }

      const data = await login(email, password);
      console.log("LOGIN RESPONSE:", data);
      
      if (!data.token || !data.role) {
        throw new Error("Invalid response from server (missing token/role)");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name || data.email);
      
      console.log("STORED TOKEN:", localStorage.getItem("token"));
      console.log("STORED ROLE:", localStorage.getItem("role"));
      
      // Automatic redirect based on role (Step 3/7)
      setTimeout(() => {
        if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
          console.log("✅ Admin redirecting to /admin/dashboard");
          window.location.href = "/admin/dashboard";
        } else {
          console.log("✅ User redirecting to /dashboard");
          window.location.href = "/dashboard";
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-purple-100 rounded-full blur-3xl opacity-40"></div>

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
            <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Login to portal</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <p className="text-rose-600 text-xs font-bold leading-tight">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                  placeholder="admin@healthwell.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Log In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Forgot Password?</Link>
            <p className="text-slate-400 text-xs font-bold pt-2 border-t border-slate-50">
              New here? <Link to="/signup" className="text-blue-600 hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
