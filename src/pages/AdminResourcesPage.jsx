import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { Plus, Edit2, Trash2, X, ExternalLink } from "lucide-react";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [formData, setFormData] = useState({
    title: "", author: "", category: "Fitness", pdfUrl: "", coverImageUrl: "", description: "", content: ""
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/resources");
      setResources(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await apiClient.delete(`/api/admin/resources/${id}`);
      fetchResources();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await apiClient.put(`/api/admin/resources/${editingResource.id}`, formData);
      } else {
        await apiClient.post("/api/admin/resources", formData);
      }
      setShowModal(false);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      alert("Failed to save resource");
    }
  };

  const openForm = (res = null) => {
    if (res) {
      setEditingResource(res);
      setFormData(res);
    } else {
      setEditingResource(null);
      setFormData({ title: "", author: "", category: "Fitness", pdfUrl: "", coverImageUrl: "", description: "", content: "" });
    }
    setShowModal(true);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: 0 }}>Library Content</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>Manage your ebooks and learning materials</p>
        </div>
        <button 
          onClick={() => openForm()}
          style={{
            backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "12px",
            border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px",
            fontSize: "14px", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"
          }}
        >
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>Loading Resources...</div>
      ) : error ? (
        <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fecaca", padding: "20px", borderRadius: "12px", color: "#991b1b" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : resources.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", border: "2px dashed #e2e8f0", borderRadius: "20px", color: "#64748b" }}>
          <p style={{ fontWeight: "600" }}>No resources available yet.</p>
          <button onClick={() => openForm()} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: "700" }}>Create your first one</button>
        </div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Author</th>
                <th style={thStyle}>Category</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: "700", color: "#1e293b" }}>{res.title}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>ID: {res.id}</div>
                  </td>
                  <td style={tdStyle}>{res.author}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle}>{res.category}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button onClick={() => openForm(res)} style={iconBtnStyle("#3b82f6")} title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(res.id)} style={iconBtnStyle("#ef4444")} title="Delete"><Trash2 size={16} /></button>
                      <a href={res.pdfUrl} target="_blank" rel="noreferrer" style={iconBtnStyle("#64748b")} title="View PDF"><ExternalLink size={16} /></a>
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
                {editingResource ? "Edit Resource" : "Create New Resource"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <Field label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} required />
                <Field label="Author" value={formData.author} onChange={v => setFormData({...formData, author: v})} required />
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  style={inputStyle}
                >
                  {["Fitness", "Nutrition", "Mental Health", "Sleep", "Wellness", "Psychology", "Health Economics"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <Field label="PDF Link" value={formData.pdfUrl} onChange={v => setFormData({...formData, pdfUrl: v})} placeholder="https://..." required />
              <div style={{ height: "12px" }} />
              <Field label="Cover Image URL" value={formData.coverImageUrl} onChange={v => setFormData({...formData, coverImageUrl: v})} placeholder="https://..." />
              
              <div style={{ marginTop: "16px" }}>
                <label style={labelStyle}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>
                  {editingResource ? "Save Changes" : "Create Resource"}
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
const badgeStyle = { backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" };
const iconBtnStyle = (color) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f1f5f9", color, cursor: "pointer", transition: "all 0.2s" });
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContentStyle = { backgroundColor: "white", padding: "32px", borderRadius: "24px", width: "560px", maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" };
const cancelBtnStyle = { padding: "10px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: "700", fontSize: "14px", cursor: "pointer" };
const saveBtnStyle = { padding: "10px 24px", borderRadius: "12px", border: "none", background: "#1e293b", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
