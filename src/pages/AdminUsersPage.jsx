import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { Trash2, Shield, User, Mail, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "ADMIN") {
      alert("Security Protocol: Cannot delete an Administrator account.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await apiClient.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Action restricted or network error.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: 0 }}>Registered Members</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>Manage platform access and user roles</p>
        </div>
        <div style={{ position: "relative", width: "300px" }}>
          <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: "100%", padding: "10px 14px 10px 36px", borderRadius: "12px", border: "1px solid #e2e8f0", 
              background: "white", fontSize: "14px", fontWeight: "500", outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>Syncing user directory...</div>
      ) : error ? (
        <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fecaca", padding: "20px", borderRadius: "12px", color: "#991b1b" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", border: "2px dashed #e2e8f0", borderRadius: "20px", color: "#64748b" }}>
          <p style={{ fontWeight: "600" }}>No users found matching your search.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th style={thStyle}>User Identity</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Role / Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Protection</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ 
                        width: "36px", height: "36px", background: u.role === "ADMIN" ? "#eff6ff" : "#f1f5f9", 
                        borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                        color: u.role === "ADMIN" ? "#3b82f6" : "#64748b"
                      }}>
                        {u.role === "ADMIN" ? <Shield size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1e293b" }}>{u.name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>UID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={14} style={{ color: "#94a3b8" }} />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={u.role === "ADMIN" ? adminBadgeStyle : userBadgeStyle}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {u.role !== "ADMIN" ? (
                      <button onClick={() => handleDelete(u.id, u.role)} style={iconBtnStyle("#ef4444")} title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>System Admin</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const thStyle = { padding: "16px 20px", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle = { padding: "16px 20px", fontSize: "14px", color: "#475569" };
const userBadgeStyle = { backgroundColor: "#f0fdf4", color: "#166534", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" };
const adminBadgeStyle = { backgroundColor: "#eff6ff", color: "#1e40af", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" };
const iconBtnStyle = (color) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f1f5f9", color, cursor: "pointer", transition: "all 0.2s" });
