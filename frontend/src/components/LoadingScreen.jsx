import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const LoadingScreen = ({ fullScreen = false }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: fullScreen ? '100vh' : '100%',
      width: '100%',
      background: fullScreen ? '#f8fafc' : 'transparent',
      gap: '1.5rem'
    }}>
      <div style={{ position: 'relative' }}>
        {/* Animated Gradient Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--accent)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
          }}
        />
        
        {/* Centered Pulsing Logo */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={32} />
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: 700, 
          color: '#64748b', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          fontFamily: 'Outfit'
        }}
      >
        Securing Environment...
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
