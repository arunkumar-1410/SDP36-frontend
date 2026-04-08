import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Plus, Edit2, Trash2, X, ExternalLink, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboard } from './AdminDashboard';

export const ManageResources = () => {
    const [resources, setResources] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Health Economics',
        description: '',
        content: '',
        pdfUrl: '',
        coverImageUrl: ''
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await apiClient.get('/api/admin/resources');
            setResources(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (res = null) => {
        if (res) {
            setEditingResource(res);
            setFormData(res);
        } else {
            setEditingResource(null);
            setFormData({ title: '', author: '', category: 'Health Economics', description: '', content: '', pdfUrl: '', coverImageUrl: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                await apiClient.put(`/api/admin/resources/${editingResource.id}`, formData);
            } else {
                await apiClient.post('/api/admin/resources', formData);
            }
            fetchResources();
            setShowModal(false);
            alert('Resource updated successfully');
        } catch (err) {
            alert('Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await apiClient.delete(`/api/admin/resources/${id}`);
            fetchResources();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <AdminDashboard>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Manage Resources</h2>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Resource
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">#</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Cover</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Title</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Author</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">PDF</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {resources.map((res, i) => (
                            <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-slate-400">{i + 1}</td>
                                <td className="px-6 py-4">
                                    <img src={res.coverImageUrl} className="w-[50px] h-[50px] object-cover rounded-md border border-slate-100" />
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{res.title}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-500">{res.author}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase border border-blue-100">
                                        {res.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <a href={res.pdfUrl} target="_blank" className="text-slate-300 hover:text-blue-500 transition-all">
                                        <ExternalLink size={18} />
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(res)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(res.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-all"><Trash2 size={16} /></button>
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
                                <h3 className="text-2xl font-black text-slate-900">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} required />
                                    <Input label="Author" value={formData.author} onChange={v => setFormData({...formData, author: v})} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                                    <select 
                                      value={formData.category} 
                                      onChange={e => setFormData({...formData, category: e.target.value})}
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs"
                                    >
                                        {['Health Economics', 'Nutrition', 'Psychology', 'Fitness', 'Sleep', 'Mental Health'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <Input label="PDF URL" value={formData.pdfUrl} onChange={v => setFormData({...formData, pdfUrl: v})} />
                                <Input label="Cover Image URL" value={formData.coverImageUrl} onChange={v => setFormData({...formData, coverImageUrl: v})} />
                                <Textarea label="Short Description" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
                                <Textarea label="Content" value={formData.content} onChange={v => setFormData({...formData, content: v})} />
                                <button className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-600 transition-all">
                                    {editingResource ? 'Update Changes' : 'Create Resource'}
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

const Textarea = ({ label, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400">{label}</label>
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-xs min-h-[80px]"
        />
    </div>
);
