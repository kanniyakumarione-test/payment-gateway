import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Zap, TrendingUp } from 'lucide-react';
// Hero section with dynamic visuals
import heroImg from '../assets/hero-dashboard.png';

const Hero = () => {
  return (
    <header style={{ padding: '10rem 0 6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <div style={{ 
          position: 'absolute', top: '-20%', right: '-10%', width: '80%', height: '80%', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
          filter: 'blur(80px)', borderRadius: '50%'
        }} />
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ 
            display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', 
            color: 'var(--primary)', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' 
          }}>
            New: AuraPay X is now live!
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--bg-dark)', lineHeight: 1.1 }}>
            Payments infrastructure for the <span className="gradient-text">next generation</span>.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '540px' }}>
            Empower your business with AuraPay's suite of financial tools. From global checkouts to automated payroll, we handle the complexity so you can focus on growth.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button className="btn-primary" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none',
              borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}>
              Start for Free <ArrowRight size={20} />
            </button>
            <button style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem',
              background: 'var(--bg-alt)', color: 'var(--text-main)', border: '1px solid #e2e8f0',
              borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer'
            }}>
              <PlayCircle size={20} /> Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <img src={heroImg} alt="Dashboard" style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }} />
          
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', top: '-20px', right: '-30px', width: '180px',
              background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <Zap size={14} color="var(--primary)" /> Quick Payout
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$4,250.00</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderRadius: '100px', display: 'inline-block', marginTop: '0.5rem' }}>
              Completed
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ 
              position: 'absolute', bottom: '-40px', left: '-40px', width: '220px',
              background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <TrendingUp size={14} color="var(--secondary)" /> Daily Volume
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', marginTop: '1rem' }}>
              {[40, 60, 50, 80, 90].map((h, i) => (
                <div key={i} style={{ flex: 1, background: 'var(--primary)', borderRadius: '4px', opacity: 0.6, height: `${h}%` }} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
