import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '../api/client';
import { User, Activity, Bookmark, Clock, XCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const res = await apiClient.get('/api/user/dashboard');
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleUnenroll = async (programId) => {
        if (!window.confirm('Are you sure you want to unenroll from this program?')) return;
        try {
            await apiClient.delete(`/api/user/unenroll/${programId}`);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to unenroll');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                                <User size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.name}</h2>
                            <p className="text-slate-400 font-medium mb-6">{user?.email}</p>
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                {user?.role} Member
                            </span>
                        </div>

                        {/* Stats Card */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <Activity className="text-blue-500 mb-2" size={24} />
                                <p className="text-2xl font-black">{data?.totalEnrolled || 0}</p>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Programs</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <Bookmark className="text-indigo-500 mb-2" size={24} />
                                <p className="text-2xl font-black">{data?.totalResourcesAccessed || 0}</p>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Resources</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Programs Section */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-900">My Enrolled Programs</h3>
                                {(!data?.enrolledPrograms || data.enrolledPrograms.length === 0) && (
                                    <Link to="/programs" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                        Browse Programs <ExternalLink size={14} />
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-4">
                                {data?.enrolledPrograms?.length > 0 ? (
                                    data.enrolledPrograms.map((prog) => (
                                        <div key={prog.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                    <Activity size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prog.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                                                        <span>By {prog.instructor}</span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span>{prog.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleUnenroll(prog.id)}
                                                className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Unenroll"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
                                        <p className="text-slate-400 font-bold mb-4">No programs enrolled yet.</p>
                                        <Link to="/programs" className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                                            Explore Programs
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* History Section */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-900">Resource History</h3>
                                <Link to="/resources" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    Browse Library <ExternalLink size={14} />
                                </Link>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                {data?.resourceHistory?.length > 0 ? (
                                    <div className="divide-y divide-slate-50">
                                        {data.resourceHistory.map((res) => (
                                            <div key={res.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Bookmark size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{res.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                    <Clock size={14} />
                                                    {new Date(res.accessedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 font-bold">
                                        No resources accessed yet.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
