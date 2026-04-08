import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, Layout, ShieldCheck, Home, BookOpen, Activity, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Programs', path: '/programs', icon: Activity },
    { name: 'Support', path: '/support', icon: HeartPulse },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass relative overflow-hidden rounded-[2rem] px-8 py-3.5 flex items-center justify-between border border-white/20 shadow-xl transition-all duration-500 ${
          scrolled ? 'shadow-blue-900/5' : ''
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-all">
              <span className="text-white font-black text-xl leading-none">HW</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-slate-900 tracking-tight block leading-none">HealthWell</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mt-0.5">Wellness Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-widest font-black transition-all hover:text-blue-600 flex items-center gap-2 ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <link.icon size={14} className="opacity-50" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition-all"
                >
                  <Layout size={14} /> Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-all"
                  >
                    <ShieldCheck size={14} /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-rose-500 font-bold text-xs hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full px-6 py-4 lg:hidden"
          >
            <div className="glass rounded-[2rem] p-8 space-y-6 shadow-2xl border border-white/20">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="flex items-center gap-3 text-lg font-bold text-slate-600">
                    <link.icon size={20} className="text-blue-500" /> {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-100 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-3 text-slate-700 font-bold">
                      <Layout size={20} /> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 text-indigo-700 font-bold">
                        <ShieldCheck size={20} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 text-rose-500 font-bold w-full text-left">
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block text-center py-4 text-slate-500 font-bold">Log In</Link>
                    <Link to="/signup" className="block text-center py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">Join Now</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
