import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '@/context/AuthContext';
import { Clock, Award, User, CheckCircle, Play, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [program, setProgram] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [pRes, eRes] = await Promise.all([
                apiClient.get(`/api/programs/${id}`),
                isAuthenticated ? apiClient.get(`/api/programs/${id}/enrollment`) : Promise.resolve({ data: { isEnrolled: false } })
            ]);
            setProgram(pRes.data);
            setEnrolled(eRes.data.isEnrolled);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await apiClient.post(`/api/programs/${id}/enroll`);
            setEnrolled(true);
            alert('Success! Welcome to the program.');
        } catch (err) {
            alert('Enrollment failed');
        }
    };

    if (loading) return <div className="min-h-screen pt-40 text-center text-slate-400 font-black uppercase">Loading Course...</div>;
    if (!program) return <div className="min-h-screen pt-40 text-center">Program not found</div>;

    const learnItems = program.learnItems ? program.learnItems.split(',').map(i => i.trim()) : [];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-28">
            <div className="max-w-7xl mx-auto px-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-all mb-8">
                    <ArrowLeft size={18} /> Back to Programs
                </button>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
                            <div className="h-[400px] relative">
                                <img src={program.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block shadow-xl">{program.category}</span>
                                    <h1 className="text-4xl font-black text-white">{program.title}</h1>
                                </div>
                            </div>
                            
                            <div className="p-10 space-y-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-4">About this Program</h3>
                                    <p className="text-slate-500 font-medium leading-[1.8] text-lg italic">
                                        "{program.description}"
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                            <CheckCircle size={16} className="text-indigo-500" /> What you'll learn
                                        </h4>
                                        <ul className="space-y-4">
                                            {learnItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                    <div className="w-5 h-5 bg-white border border-slate-100 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">{idx + 1}</div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                            <Play size={16} className="text-indigo-500" /> Syllabus Preview
                                        </h4>
                                        <div className="space-y-4">
                                            {[1,2,3].map(n => (
                                                <div key={n} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 font-black text-[10px]">{n}</div>
                                                    <p className="text-xs font-bold text-slate-900">Module Introduction {n}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Section */}
                        {enrolled && (
                            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100">
                                <div className="aspect-video bg-slate-900 rounded-[1.5rem] relative flex items-center justify-center overflow-hidden">
                                     <div className="text-center group cursor-pointer z-10">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-2xl mb-4">
                                            <Play className="text-white fill-white" size={32} />
                                        </div>
                                        <p className="text-white font-black uppercase tracking-widest text-xs">Play Lesson 1</p>
                                     </div>
                                     <img src={program.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Info Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 sticky top-32">
                           <div className="space-y-6 mb-8">
                                <InfoItem icon={Clock} label="Duration" value={program.duration} />
                                <InfoItem icon={Award} label="Skill Level" value={program.level} />
                                <InfoItem icon={User} label="Instructor" value={program.instructorName} />
                                <InfoItem icon={Users} label="Enrolled" value="1,240+ Students" />
                           </div>

                           {enrolled ? (
                               <div className="p-6 bg-emerald-50 text-emerald-600 rounded-3xl text-center font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-100">
                                   <CheckCircle size={18} /> You're Enrolled!
                               </div>
                           ) : (
                               <button 
                                   onClick={handleEnroll}
                                   className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-100"
                               >
                                   Join Program
                               </button>
                           )}
                           
                           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">
                               30-day wellbeing guarantee
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 text-indigo-500 rounded-xl">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
    </div>
);
