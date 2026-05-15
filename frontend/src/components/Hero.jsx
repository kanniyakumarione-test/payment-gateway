import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, CheckCircle, IndianRupee, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '400px', height: '400px', background: 'rgba(168, 85, 247, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1 }} />

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.1)', marginBottom: '2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>New: KKPay Direct UPI is live</span>
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>
            Zero Commission. <br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unlimited Payments.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '540px' }}>
            The first truly independent payment gateway for Indian businesses. Receive money directly into your bank account with zero fees and instant settlement.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/login" style={{ padding: '1.25rem 2.5rem', background: 'var(--primary)', color: 'white', borderRadius: '1rem', textDecoration: 'none', fontWeight: 700, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}>
              Start Now <ArrowRight size={20} />
            </Link>
          </div>

          <div style={{ marginTop: '3.5rem', display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              <CheckCircle size={18} color="#10b981" /> No KYC required
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              <CheckCircle size={18} color="#10b981" /> Instant Settlement
            </div>
          </div>
        </motion.div>

        {/* CSS-Only Premium Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ position: 'relative', perspective: '1000px' }}
        >
          <div style={{ 
            width: '100%', height: '400px', background: 'white', 
            borderRadius: '2rem', border: '1px solid #e2e8f0', 
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)',
            transform: 'rotateY(-15deg) rotateX(10deg)',
            padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '40%', height: '12px', background: '#f1f5f9', borderRadius: '4px' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '80px', background: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', padding: '0.75rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '0.5rem' }} />
                  <div style={{ width: '60%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }} />
                </div>
              ))}
            </div>

            <div style={{ flex: 1, background: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '30%', height: '12px', background: '#f1f5f9', borderRadius: '4px' }} />
                <div style={{ width: '50px', height: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '1rem 0' }}>
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 }}
                    style={{ flex: 1, background: 'var(--primary)', borderRadius: '4px', opacity: 0.3 + (i * 0.1) }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '-10%', right: '-10%', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp color="#10b981" size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Successful</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹42,500.00</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '10%', left: '-15%', background: 'white', padding: '1.25rem', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet color="var(--primary)" size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Withdrawn</div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>₹12,000.00</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Social Proof */}
      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem' }}>
          Trusted by over 500+ Indian Merchants
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', opacity: 0.5, filter: 'grayscale(1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>PHONEPE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>GPAY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>PAYTM</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>HDFC BANK</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>ICICI</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
