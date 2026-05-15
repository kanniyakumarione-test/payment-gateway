import React from 'react';

const Logo = ({ size = 32 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <div style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
      borderRadius: size / 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    }}>
      <span style={{ color: 'white', fontWeight: 900, fontSize: size / 2, fontFamily: 'Outfit' }}>K</span>
    </div>
    <span style={{ fontSize: `${size * 0.6}px`, fontWeight: 800, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KKDesign</span>
  </div>
);

export default Logo;
