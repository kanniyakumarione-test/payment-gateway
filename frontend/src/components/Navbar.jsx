import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Logo from './Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.8)' : 'none'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* LOGO ON THE FAR LEFT */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo size={32} />
        </Link>

        {/* BUTTON ON THE FAR RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            style={{ 
              padding: '0.875rem 2rem', 
              background: '#1e293b', 
              color: 'white', 
              border: 'none', 
              borderRadius: '1rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 20px 40px -10px rgba(30, 41, 59, 0.3)',
              fontFamily: 'Outfit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(30, 41, 59, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(30, 41, 59, 0.3)';
            }}
          >
            {user ? 'Dashboard' : "Let's Start"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
