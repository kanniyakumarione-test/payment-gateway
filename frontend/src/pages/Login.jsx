import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Logged in successfully! ✨');
      navigate('/dashboard');
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', padding: '3rem', borderRadius: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={32} fill="currentColor" />
          </div>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1e293b', marginBottom: '0.75rem' }}>KKDesign</h1>
        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2.5rem' }}>Login to your dashboard to manage your celebrations.</p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '1.25rem', background: 'white', border: '2px solid #f1f5f9', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s ease' }}
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" style={{ width: '20px' }} />
              Sign in with Google
            </>
          )}
        </button>

        <div style={{ marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          By signing in, you agree to our Terms of Service.
        </div>
      </motion.div>
    </div>
  );
};

// Simple useState helper since I am overwriting
import { useState } from 'react';

export default Login;
