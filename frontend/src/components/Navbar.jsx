import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
      transition: 'var(--transition)',
      background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '8px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: 'white', borderRadius: '50%' }} />
          </div>
          <span>AuraPay</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
          {['Payments', 'Banking', 'Payroll', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Login</Link>
          <Link to="/login" style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.75rem', 
            fontWeight: 600, 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            textDecoration: 'none'
          }}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
