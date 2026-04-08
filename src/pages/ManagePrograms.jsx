import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboard } from './AdminDashboard';

export const ManagePrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Fitness',
        duration: '',
        level: 'Beginner',
        imageUrl: '',
        instructorName: '',
        learnItems: ''
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await apiClient.get('/api/admin/programs');
            setPrograms(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (p = null) => {
        if (p) {
            setEditingProgram(p);
            setFormData(p);
        } else {
            setEditingProgram(null);
            setFormData({ title: '', description: '', category: 'Fitness', duration: '', level: 'Beginner', imageUrl: '', instructorName: '', learnItems: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await apiClient.put(`/api/admin/programs/${editingProgram.id}`, formData);
            } else {
                await apiClient.post('/api/admin/programs', formData);
            }
            fetchPrograms();
            setShowModal(false);
            alert('Program saved successfully');
        } catch (err) {
            alert('Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this program?')) return;
        try {
            await apiClient.delete(`/api/admin/programs/${id}`);
            fetchPrograms();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <AdminDashboard>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Manage Programs</h2>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Program
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">#</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Title</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Duration</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Level</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Enrolled</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {programs.map((p, i) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-slate-400">{i + 1}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{p.title}</td>
                                <td className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">{p.category}</td>
                                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{p.duration}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase border border-indigo-100">
                                        {p.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-black text-xs text-slate-900">{p.enrolledCount}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900">{editingProgram ? 'Edit Program' : 'Add New Program'}</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                <Input label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                                        <select 
                                          value={formData.category} 
                                          onChange={e => setFormData({...formData, category: e.target.value})}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs"
                                        >
                                            {['Fitness', 'Nutrition', 'Mental Health', 'Sleep', 'Wellness'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Level</label>
                                        <select 
                                          value={formData.level} 
                                          onChange={e => setFormData({...formData, level: e.target.value})}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs"
                                        >
                                            {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Duration" value={formData.duration} onChange={v => setFormData({...formData, duration: v})} placeholder="e.g. 8 weeks" />
                                    <Input label="Instructor Name" value={formData.instructorName} onChange={v => setFormData({...formData, instructorName: v})} />
                                </div>
                                <Input label="Image URL" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
                                <Textarea label="Description" value={formData.description} onChange={v => setFormData({...formData, description: v})} required />
                                <Textarea label="What You'll Learn (comma separated)" value={formData.learnItems} onChange={v => setFormData({...formData, learnItems: v})} />
                                
                                <button className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-600 transition-all">
                                    {editingProgram ? 'Update Program' : 'Create Program'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminDashboard>
    );
};

const Input = ({ label, value, onChange, ...rest }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400">{label}</label>
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs focus:ring-4 focus:ring-indigo-500/5 outline-none"
          {...rest}
        />
    </div>
);

const Textarea = ({ label, value, onChange, ...rest }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400">{label}</label>
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-xs min-h-[80px]"
          {...rest}
        />
    </div>
);
