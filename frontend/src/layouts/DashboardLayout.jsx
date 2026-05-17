import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, PlusCircle, Settings, LogOut, Menu, X, 
  User, Bell, LayoutDashboard, Send, Sparkles
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

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
          <Logo size={28} />
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
      {/* Desktop Sidebar (Refined and always open) */}
      <aside 
        style={{ 
          width: '280px',
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          padding: '2rem 1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          zIndex: 50 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
          <Logo size={36} />
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
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Card & Sign Out at Bottom of Sidebar */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '1.5rem', 
            marginBottom: '1.25rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: '#f1f5f9', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={18} color="#64748b" />
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.displayName || 'Designer'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              width: '100%',
              padding: '0.875rem 1rem', 
              borderRadius: '0.75rem', 
              border: 'none', 
              background: 'rgba(239, 68, 68, 0.05)', 
              color: '#ef4444', 
              cursor: 'pointer', 
              fontWeight: 700,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area without the top desktop header bar */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ padding: '2.5rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
