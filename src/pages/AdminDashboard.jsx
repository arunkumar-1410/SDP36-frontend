import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { Users, BookOpen, Target, BookMarked, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalResources: 0,
    totalPrograms: 0, totalBookReads: 0,
    totalEnrollments: 0
  });
  const [activity, setActivity] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [s, a, t, e] = await Promise.all([
        apiClient.get("/api/admin/stats"),
        apiClient.get("/api/admin/recent-activity"),
        apiClient.get("/api/admin/top-resources"),
        apiClient.get("/api/admin/enrollments-list")
      ]);
      
      setStats(s.data);
      setActivity(a.data);
      setTopBooks(t.data);
      setEnrollments(e.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={24} />, color: "#3b82f6" },
    { label: "Library Assets", value: stats.totalResources, icon: <BookOpen size={24} />, color: "#10b981" },
    { label: "Active Programs", value: stats.totalPrograms, icon: <Target size={24} />, color: "#8b5cf6" },
    { label: "Engagement Hub", value: stats.totalBookReads, icon: <Activity size={24} />, color: "#f59e0b" },
  ];

  if (loading) return (
    <div style={{ textAlign: "center", padding: "100px", color: "#64748b", fontWeight: "600" }}>
      Loading platform analytics...
    </div>
  );

  return (
    <>
      {/* Stat Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "32px" }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ 
            backgroundColor: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)", borderLeft: `4px solid ${card.color}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#1e293b" }}>{card.value}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginTop: "4px" }}>{card.label}</div>
              </div>
              <div style={{ color: card.color, opacity: 0.8 }}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Recent Activity */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <Activity size={18} />
            <span>Recent Reading Activity</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Resource</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Access Time</th>
                </tr>
              </thead>
              <tbody>
                {activity.slice(0, 5).map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{row.userName}</td>
                    <td style={{ ...tdStyle, fontWeight: "600", color: "#3b82f6" }}>{row.resourceTitle}</td>
                    <td style={{ ...tdStyle, textAlign: "right", color: "#94a3b8", fontSize: "12px" }}>
                      {new Date(row.accessedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Resources */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <BookMarked size={18} />
            <span>Trending Resources</span>
          </div>
          <div style={{ padding: "0 20px 20px 20px" }}>
            {topBooks.slice(0, 5).map((book, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700", color: "#475569" }}>{book.resourceTitle}</span>
                  <span style={{ fontWeight: "800", color: "#3b82f6" }}>{book.readCount} reads</span>
                </div>
                <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", background: "#3b82f6", 
                    width: `${Math.min(100, (book.readCount / (topBooks[0]?.readCount || 1)) * 100)}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Enrollments */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <Target size={18} />
          <span>New Program Enrollments</span>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Program</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.slice(0, 5).map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: "700" }}>{row.userName}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{row.userEmail}</div>
                </td>
                <td style={{ ...tdStyle, fontWeight: "700", color: "#8b5cf6" }}>{row.programTitle}</td>
                <td style={{ ...tdStyle, textAlign: "right", color: "#94a3b8" }}>
                  {new Date(row.enrolledAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const sectionCardStyle = { backgroundColor: "white", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflow: "hidden" };
const sectionHeaderStyle = { padding: "20px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "800", color: "#1e293b", fontSize: "15px", borderBottom: "1px solid #f1f5f9" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const thStyle = { padding: "12px 20px", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle = { padding: "16px 20px", fontSize: "14px", color: "#475569" };
