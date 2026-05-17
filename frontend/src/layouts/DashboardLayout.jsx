import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, PlusCircle, Settings, LogOut, Menu, X, 
  User, Bell, LayoutDashboard, Send
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '../context/ToastContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = auth.currentUser;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Home', path: '/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Create', path: '/dashboard/create' },
    { icon: <Send size={20} />, label: 'Invites', path: '/dashboard/my-invites' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
        {/* Mobile Header */}
        <header style={{ background: 'white', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <div style={{ width: '32px', height: '32px', background: '#6366f1', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               
             </div>
             <span style={{ fontWeight: 900, fontFamily: 'Outfit', color: '#6366f1', fontSize: '1.125rem' }}>KKDesign</span>
          </div>
          <button onClick={handleLogout} style={{ color: '#ef4444', background: 'none', border: 'none' }}><LogOut size={20} /></button>
        </header>

        <main style={{ padding: '1.5rem' }}>
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0.5rem', zIndex: 1000, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#6366f1' : '#94a3b8',
                transition: '0.2s ease'
              }}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                {item.icon}
              </motion.div>
              <span style={{ fontSize: '0.625rem', fontWeight: 800 }}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Desktop Sidebar (Same as before but refined) */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
        style={{ background: 'white', borderRight: '1px solid #e2e8f0', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 50 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#6366f1', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            
          </div>
          {isSidebarOpen && <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'Outfit', color: '#6366f1' }}>KKDesign</span>}
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#6366f1' : '#64748b',
                background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                fontWeight: 700,
                transition: '0.2s ease'
              }}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 700, marginTop: 'auto' }}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Sign Out</span>}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.displayName || 'Designer'}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#64748b" />
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
