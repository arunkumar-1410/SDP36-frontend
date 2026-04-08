import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { Plus, Edit2, Trash2, X, Clock, User } from "lucide-react";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  const [formData, setFormData] = useState({
    title: "", instructor: "", duration: "", category: "Fitness", description: "", imageUrl: ""
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/programs");
      setPrograms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await apiClient.delete(`/api/admin/programs/${id}`);
      fetchPrograms();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await apiClient.put(`/api/admin/programs/${editingProgram.id}`, formData);
      } else {
        await apiClient.post("/api/admin/programs", formData);
      }
      setShowModal(false);
      setEditingProgram(null);
      fetchPrograms();
    } catch (err) {
      alert("Failed to save program");
    }
  };

  const openForm = (prog = null) => {
    if (prog) {
      setEditingProgram(prog);
      setFormData(prog);
    } else {
      setEditingProgram(null);
      setFormData({ title: "", instructor: "", duration: "", category: "Fitness", description: "", imageUrl: "" });
    }
    setShowModal(true);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: 0 }}>Wellness Programs</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>Track and manage active training courses</p>
        </div>
        <button 
          onClick={() => openForm()}
          style={{
            backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "12px",
            border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px",
            fontSize: "14px", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"
          }}
        >
          <Plus size={18} /> New Program
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>Loading Programs...</div>
      ) : error ? (
        <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fecaca", padding: "20px", borderRadius: "12px", color: "#991b1b" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : programs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", border: "2px dashed #e2e8f0", borderRadius: "20px", color: "#64748b" }}>
          <p style={{ fontWeight: "600" }}>No programs found.</p>
          <button onClick={() => openForm()} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: "700" }}>Create your first one</button>
        </div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th style={thStyle}>Program Details</th>
                <th style={thStyle}>Instructor</th>
                <th style={thStyle}>Category / Length</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog) => (
                <tr key={prog.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: "700", color: "#1e293b" }}>{prog.title}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Active Course</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "24px", height: "24px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                        <User size={14} />
                      </div>
                      <span style={{ fontWeight: "600" }}>{prog.instructor}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={badgeStyle}>{prog.category}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                        <Clock size={12} /> {prog.duration}
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button onClick={() => openForm(prog)} style={iconBtnStyle("#3b82f6")} title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(prog.id)} style={iconBtnStyle("#ef4444")} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                {editingProgram ? "Edit Program" : "Create New Program"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <Field label="Program Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <Field label="Instructor" value={formData.instructor} onChange={v => setFormData({...formData, instructor: v})} required />
                <Field label="Duration" value={formData.duration} onChange={v => setFormData({...formData, duration: v})} placeholder="e.g. 30 days" required />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={inputStyle}
                  >
                    {["Fitness", "Nutrition", "Mental Health", "Sleep", "Wellness"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Field label="Image URL" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} placeholder="https://..." />
              </div>

              <div style={{ marginTop: "16px" }}>
                <label style={labelStyle}>Program Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>
                  {editingProgram ? "Save Changes" : "Create Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const Field = ({ label, value, onChange, placeholder, required = false }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      required={required}
      style={inputStyle}
    />
  </div>
);

const thStyle = { padding: "16px 20px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle = { padding: "16px 20px", fontSize: "14px", color: "#475569" };
const labelStyle = { display: "block", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.02em" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", fontWeight: "500", outline: "none" };
const badgeStyle = { backgroundColor: "#f0f9ff", color: "#0369a1", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", textTransform: "uppercase" };
const iconBtnStyle = (color) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f1f5f9", color, cursor: "pointer", transition: "all 0.2s" });
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContentStyle = { backgroundColor: "white", padding: "32px", borderRadius: "24px", width: "560px", maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" };
const cancelBtnStyle = { padding: "10px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: "700", fontSize: "14px", cursor: "pointer" };
const saveBtnStyle = { padding: "10px 24px", borderRadius: "12px", border: "none", background: "#1e293b", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
