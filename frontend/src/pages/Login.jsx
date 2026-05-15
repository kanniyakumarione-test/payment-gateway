import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginWithGoogle } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      console.log("Logged in user:", user);
      // Success! Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert("Failed to login with Google. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-alt)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1.5rem', 
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '12px' }} />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem' }}>Welcome to KKPay</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Login to your merchant dashboard to manage your payments.</p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #e2e8f0', 
            background: 'white', 
            fontWeight: 600, 
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
              Sign in with Google
            </>
          )}
        </button>

        <div style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          Don't have an account? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact Sales</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
