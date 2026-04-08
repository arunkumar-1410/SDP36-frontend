import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '@/context/AuthContext';
import { Clock, Award, User, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      console.log('Fetching programs from: http://localhost:9090/api/programs');
      const pRes = await apiClient.get('/api/programs');
      
      // FIX D: Normalize field names for programs
      const mappedPrograms = (Array.isArray(pRes.data) ? pRes.data : []).map(item => ({
        ...item,
        imageUrl: item.imageUrl || item.image_url,
        instructorName: item.instructorName || item.instructor_name || item.instructor
      }));

      setPrograms(mappedPrograms);

      if (isAuthenticated) {
        const eRes = await apiClient.get('/api/programs/enrolled');
        setEnrolledIds(eRes.data.map(p => p.id));
      }
    } catch (err) {
      console.error('Failed to load programs data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (id) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await apiClient.post(`/api/programs/${id}/enroll`);
      alert('Enrollment successful!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3">Training Programs</h1>
            <p className="text-slate-500 font-medium text-lg">Master your wellness journey with expert-led courses.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? [1,2,3].map(n => <div key={n} className="h-[400px] bg-white rounded-[2rem] animate-pulse" />) : 
            programs.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="h-[200px] relative overflow-hidden bg-slate-100">
                        <img 
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-indigo-600/90 text-[10px] text-white font-black uppercase tracking-widest rounded-full">
                                {p.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> {p.duration}</span>
                            <span className="flex items-center gap-1.5"><Award size={14} className="text-indigo-500" /> {p.level}</span>
                        </div>
                        
                        <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{p.title}</h3>
                        <p className="text-indigo-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User size={14} /> {p.instructorName || 'Expert Trainer'}
                        </p>
                        
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">
                            {p.description}
                        </p>

                        <div className="mt-auto space-y-3">
                            {enrolledIds.includes(p.id) ? (
                                <Link 
                                    to={`/programs/${p.id}`}
                                    className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Play size={16} /> Continue Learning
                                </Link>
                            ) : (
                                <button 
                                    onClick={() => handleEnroll(p.id)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2"
                                >
                                    Enroll Now <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};
