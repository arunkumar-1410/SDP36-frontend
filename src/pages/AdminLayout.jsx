import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, BookOpen, Target, Users, LogOut, Bell, User, Activity } from 'lucide-react';

export default function AdminLayout({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Activity size={20} />, label: "Activity", path: "/admin/activity" },
    { icon: <BookOpen size={20} />, label: "Resources", path: "/admin/resources" },
    { icon: <Target size={20} />, label: "Programs", path: "/admin/programs" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', height: '100vh', background: '#1e293b', 
        position: 'fixed', top: 0, left: 0, 
        display: 'flex', flexDirection: 'column', zIndex: 100
      }}>
        {/* Logo Area */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', background: '#3b82f6', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '14px'
            }}>HW</div>
            <div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>HealthWell</div>
              <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map((item) => (
            <div 
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                cursor: 'pointer', marginBottom: '4px',
                fontSize: '14px', fontWeight: '500',
                transition: 'background 0.2s',
                backgroundColor: isActive(item.path) ? '#3b82f6' : 'transparent',
                color: isActive(item.path) ? 'white' : '#94a3b8'
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom Area */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <div style={{ 
              width: '36px', height: '36px', background: '#3b82f6', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontWeight: '800', color: 'white'
            }}>A</div>
            <div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Admin</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>admin@healthwell.com</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: '#ef4444', color: 'white', width: '100%',
              padding: '10px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', marginTop: '12px', fontWeight: '700',
              fontSize: '13px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', gap: '8px'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{
          background: 'white', padding: '16px 32px', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', position: 'sticky', top: 0, zIndex: 10
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ color: '#cbd5e1', cursor: 'pointer' }}><Bell size={20} /></div>
            <div style={{ 
              width: '32px', height: '32px', background: '#f1f5f9', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#64748b'
            }}><User size={18} /></div>
          </div>
        </header>

        {/* Page Content */}
        <section style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
