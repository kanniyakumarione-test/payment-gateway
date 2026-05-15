import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Logo from '../components/Logo';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem', textAlign: 'center' }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={48} />
        
        <div style={{ position: 'relative', margin: '3rem 0' }}>
          <h1 style={{ fontSize: '8rem', fontWeight: 900, color: 'rgba(99, 102, 241, 0.05)', lineHeight: 1 }}>404</h1>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={80} color="#f59e0b" />
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Outfit' }}>Lost in Space?</h2>
        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '400px' }}>
          The page you are looking for doesn't exist or has been moved to a secret vault.
        </p>

        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
            padding: '1rem 2rem', background: 'var(--primary)', color: 'white', 
            borderRadius: '1rem', textDecoration: 'none', fontWeight: 700,
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
          }}
        >
          <Home size={20} /> Back to Reality
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
