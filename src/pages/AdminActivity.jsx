import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Download, Search, User, BookOpen, Activity as ActivityIcon } from 'lucide-react';

export default function AdminActivity() {
    const [enrollments, setEnrollments] = useState([]);
    const [reads, setReads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollmentSearch, setEnrollmentSearch] = useState('');
    const [readSearch, setReadSearch] = useState('');

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const [eRes, rRes] = await Promise.all([
                apiClient.get('/api/admin/enrollments'),
                apiClient.get('/api/admin/book-reads')
            ]);
            setEnrollments(eRes.data);
            setReads(rRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = (data, filename) => {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredEnrollments = enrollments.filter(e => 
        e.userName?.toLowerCase().includes(enrollmentSearch.toLowerCase()) || 
        e.programTitle?.toLowerCase().includes(enrollmentSearch.toLowerCase())
    );

    const filteredReads = reads.filter(r => 
        r.userName?.toLowerCase().includes(readSearch.toLowerCase()) || 
        r.resourceTitle?.toLowerCase().includes(readSearch.toLowerCase())
    );

    return (
        <>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: 0 }}>Enrollments & Engagement</h1>
                <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>Detailed tracking of user interaction and course progress</p>
            </div>

            <div style={{ display: "grid", gap: "40px" }}>
                {/* Section 1: Program Enrollments */}
                <section>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <ActivityIcon size={20} style={{ color: "#3b82f6" }} />
                            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Program Enrollments</h2>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                             <div style={{ position: "relative" }}>
                                <Search style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Filter users/programs..."
                                    value={enrollmentSearch}
                                    onChange={(e) => setEnrollmentSearch(e.target.value)}
                                    style={smallInputStyle}
                                />
                            </div>
                            <button onClick={() => exportCSV(enrollments, 'enrollments.csv')} style={exportBtnStyle}>
                                <Download size={14} /> Export CSV
                            </button>
                        </div>
                    </div>
                    
                    <div style={cardStyle}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead style={{ backgroundColor: "#f8fafc" }}>
                                <tr>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Enrolled In</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnrollments.map((e, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: "700", color: "#1e293b" }}>{e.userName}</div>
                                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{e.userEmail}</div>
                                        </td>
                                        <td style={{ ...tdStyle, color: "#3b82f6", fontWeight: "700" }}>{e.programTitle}</td>
                                        <td style={{ ...tdStyle, textAlign: "right", color: "#94a3b8", fontSize: "12px" }}>
                                            {new Date(e.enrolledDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 2: Book Reading Activity */}
                <section>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <BookOpen size={20} style={{ color: "#10b981" }} />
                            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Library Reading Activity</h2>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                             <div style={{ position: "relative" }}>
                                <Search style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Filter users/books..."
                                    value={readSearch}
                                    onChange={(e) => setReadSearch(e.target.value)}
                                    style={smallInputStyle}
                                />
                            </div>
                            <button onClick={() => exportCSV(reads, 'reading_activity.csv')} style={exportBtnStyle}>
                                <Download size={14} /> Export CSV
                            </button>
                        </div>
                    </div>
                    
                    <div style={cardStyle}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead style={{ backgroundColor: "#f8fafc" }}>
                                <tr>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Book Accessed</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReads.map((r, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: "700", color: "#1e293b" }}>{r.userName}</div>
                                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{r.userEmail}</div>
                                        </td>
                                        <td style={{ ...tdStyle, color: "#10b981", fontWeight: "700" }}>{r.resourceTitle}</td>
                                        <td style={{ ...tdStyle, textAlign: "right", color: "#94a3b8", fontSize: "12px" }}>
                                            {new Date(r.dateAccessed).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}

const thStyle = { padding: "12px 20px", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle = { padding: "16px 20px", fontSize: "14px", color: "#475569" };
const cardStyle = { backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" };
const smallInputStyle = { padding: "8px 12px 8px 30px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", fontSize: "12px", fontWeight: "600", outline: "none" };
const exportBtnStyle = { display: "flex", alignItems: "center", gap: "6px", px: "12px", padding: "8px 16px", background: "#f1f5f9", color: "#475569", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" };
