import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { User, Shield, Calendar } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';

export const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, role) => {
        if (role === 'ADMIN') {
            alert('Cannot delete an Administrator account.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await apiClient.delete(`/api/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed');
        }
    };

    return (
        <AdminDashboard>
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900">Registered Members</h2>
                <p className="text-slate-500 font-medium italic">Monitor user activity and platform growth</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">#</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Privileges</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((u, i) => (
                            <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-5 text-xs font-bold text-slate-400">{i + 1}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{u.name}</p>
                                            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        u.role === 'ADMIN' 
                                        ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                                    }`}>
                                        <Shield size={10} /> {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                        <Calendar size={14} className="opacity-50" />
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Historical'}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    {u.role !== 'ADMIN' && (
                                        <button 
                                            onClick={() => handleDelete(u.id, u.role)} 
                                            className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminDashboard>
    );
};
