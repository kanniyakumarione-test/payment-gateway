import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  CreditCard, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  LogOut,
  ChevronRight,
  Code,
  Shield
} from 'lucide-react';
import { auth, logout } from '../lib/firebase';
import Logo from '../components/Logo';
import { useToast } from '../context/ToastContext';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = auth.currentUser;
  const isSuperAdmin = user?.email === 'kanniyakumarione@gmail.com';

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <ArrowUpRight size={20} />, label: 'Transactions', path: '/dashboard/transactions' },
    { icon: <CreditCard size={20} />, label: 'Payouts', path: '/dashboard/payouts' },
    { icon: <Users size={20} />, label: 'Customers', path: '/dashboard/customers' },
    { icon: <Code size={20} />, label: 'Developer Docs', path: '/dashboard/docs' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  if (isSuperAdmin) {
    menuItems.push({ icon: <Shield size={20} />, label: 'Admin Panel', path: '/dashboard/admin' });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: 'white', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50
      }}>
        <div style={{ padding: '2rem' }}>
          <Logo size={32} />
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-muted)',
                background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.925rem',
                marginBottom: '0.25rem',
                transition: 'var(--transition)'
              }}
            >
              {item.icon}
              {item.label}
              {location.pathname === item.path && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '2rem', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              color: 'var(--danger)', 
              background: 'none', 
              border: 'none', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px' }}>
        {/* Topbar */}
        <header style={{ 
          height: '80px', 
          background: 'white', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '100px', width: '400px' }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search transactions, customers..." 
              style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => showToast('You are all caught up!', 'success')}
                style={{ position: 'relative', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Bell size={22} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.displayName || 'Merchant'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Merchant ID: #{user?.uid.slice(0,4) || '8821'}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {user?.displayName?.charAt(0) || 'M'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
