import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc', 
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Premium Ambient Background Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.04) 50%, rgba(255,255,255,0) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Floating Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          padding: '0.6rem 1.25rem',
          borderRadius: '100px',
          color: '#475569',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
          zIndex: 10
        }}
        whileHover={{ scale: 1.03, color: '#0f172a', borderColor: 'rgba(99, 102, 241, 0.2)' }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft size={16} /> Back to home
      </motion.button>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.75)', 
          backdropFilter: 'blur(20px)',
          padding: '3.5rem 3rem', 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 30px 60px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.6)', 
          width: '100%', 
          maxWidth: '460px', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo Container */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.02) 100%)', 
            border: '1px solid rgba(99, 102, 241, 0.1)',
            padding: '1.25rem 2.25rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.02)'
          }}>
            <Logo size={36} />
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 900, 
          fontFamily: 'Outfit, sans-serif', 
          letterSpacing: '-0.02em',
          color: '#0f172a', 
          marginBottom: '0.75rem' 
        }}>
          Welcome Back
        </h1>
        
        {/* Subtitle */}
        <p style={{ 
          color: '#475569', 
          fontSize: '1rem', 
          lineHeight: '1.6',
          marginBottom: '2.75rem',
          fontWeight: 400
        }}>
          Login to your dashboard to manage your celebrations.
        </p>

        {/* Premium Google Sign-In Button */}
        <motion.button 
          onClick={handleGoogleLogin}
          disabled={loading}
          whileHover={loading ? {} : { 
            scale: 1.02, 
            boxShadow: '0 12px 25px rgba(99, 102, 241, 0.1)', 
            borderColor: 'rgba(99, 102, 241, 0.25)' 
          }}
          whileTap={loading ? {} : { scale: 0.98 }}
          style={{ 
            width: '100%', 
            padding: '1.1rem 1.5rem', 
            background: 'white', 
            border: '1px solid rgba(99, 102, 241, 0.15)', 
            borderRadius: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            fontSize: '1.05rem', 
            fontWeight: 700, 
            color: '#0f172a',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.03)',
            cursor: loading ? 'not-allowed' : 'pointer', 
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease' 
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} color="#6366f1" />
          ) : (
            <>
              <img 
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" 
                alt="Google" 
                style={{ width: '20px', height: '20px' }} 
              />
              Sign in with Google
            </>
          )}
        </motion.button>

        {/* Terms and conditions */}
        <div style={{ 
          marginTop: '3rem', 
          color: '#64748b', 
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '-0.01em'
        }}>
          By signing in, you agree to our{' '}
          <span 
            onClick={() => setShowTerms(true)}
            style={{ 
              color: '#6366f1', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontWeight: 600
            }}
          >
            Terms of Service
          </span>
          .
        </div>
      </motion.div>

      {/* Terms of Service Premium Modal */}
      {showTerms && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: '2.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
              padding: '2.5rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Header */}
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#0f172a',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}>
              Terms of Service
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'left' }}>
              Last updated: May 2026
            </div>

            {/* Scrollable Terms Content */}
            <div style={{
              overflowY: 'auto',
              flexGrow: 1,
              paddingRight: '0.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
              fontSize: '0.925rem',
              color: '#475569',
              lineHeight: 1.6
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>1. Account Registration</h3>
              <p style={{ marginBottom: '1.25rem' }}>
                You must sign in using a Google account to access and utilize the celebration builder dashboard. You are solely responsible for all actions taken through your account credentials.
              </p>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>2. Invitation Content Ownership</h3>
              <p style={{ marginBottom: '1.25rem' }}>
                You retain all original ownership and rights to the text copy, image assets, venue coordinates, and media files you upload to construct invitations. We will not use your invitation assets for any promotional purposes without consent.
              </p>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>3. Acceptable Use Policy</h3>
              <p style={{ marginBottom: '1.25rem' }}>
                You agree not to create, distribute, or host invitations that promote discrimination, harassment, illegal acts, or malware. Any violation may result in instant account termination.
              </p>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>4. Uptime & Availability</h3>
              <p style={{ marginBottom: '0.5rem' }}>
                While we work hard to keep KKDesign running 24/7 with 99.9% availability, the platform is provided on an "as is" and "as available" basis without warranties.
              </p>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTerms(false)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '1.125rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                textAlign: 'center'
              }}
            >
              I Agree & Close
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
