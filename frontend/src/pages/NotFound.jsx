import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, Gamepad2, X } from 'lucide-react';
import Logo from '../components/Logo';
import FlamesGame from '../components/FlamesGame';

const NotFound = () => {
  const [playGame, setPlayGame] = useState(false);

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
        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
          The page you are looking for doesn't exist or has been moved to a secret vault.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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

          <button 
            onClick={() => setPlayGame(true)}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
              padding: '1rem 2rem', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', 
              borderRadius: '1rem', border: '2px solid var(--primary)', fontWeight: 700,
              cursor: 'pointer', outline: 'none', transition: 'all 0.25s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Gamepad2 size={20} /> Play FLAMES Game
          </button>
        </div>
      </motion.div>

      {/* Render the FLAMES Game overlay */}
      {playGame && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '2rem 1rem'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            background: 'white',
            borderRadius: '2rem',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setPlayGame(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100
              }}
            >
              <X size={20} color="#1a1a1a" />
            </button>

            {/* Embed FlamesGame */}
            <FlamesGame
              theme={{
                glass: 'rgba(255,255,255,0.95)',
                glassBorder: 'rgba(0,0,0,0.05)',
                text: '#1a1a1a',
                inputBg: '#ffffff',
                inputText: '#1a1a1a',
                primary: '#ff6b6b',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFound;


