import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Gift, PartyPopper, Sparkles, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#1a1a1a', overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', position: 'fixed', width: '100%', top: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--primary)' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={24} fill="currentColor" />
          </div>
          KKDesign
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: 'white', borderRadius: '100px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '10rem 5% 5rem', textAlign: 'center', background: 'radial-gradient(circle at top right, #fff5f5, #fff)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#fff0f0', color: '#ff6b6b', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '2rem' }}>
            <Sparkles size={16} /> The Elite Invitation Platform
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem' }}>
            Celebrate Moments, <br />
            <span style={{ color: '#ff6b6b' }}>Share the Magic.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Create breathtaking digital invitations for weddings, birthdays, and parties in seconds. Beautiful, responsive, and elite.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ padding: '1.25rem 2.5rem', background: '#1a1a1a', color: 'white', borderRadius: '1rem', fontSize: '1.125rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Start Creating <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '6rem', maxWidth: '1200px', margin: '6rem auto 0' }}>
          {[
            { icon: <Heart color="#ff6b6b" />, title: 'Weddings', desc: 'Elegant themes for your most special day.' },
            { icon: <Gift color="#4ecdc4" />, title: 'Birthdays', desc: 'Fun and vibrant designs for all ages.' },
            { icon: <PartyPopper color="#ffe66d" />, title: 'Events', desc: 'Professional gala and corporate invites.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              style={{ padding: '2.5rem', background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            >
              <div style={{ width: '50px', height: '50px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section style={{ padding: '5rem 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#1a1a1a', borderRadius: '3rem', padding: '4rem', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,107,107,0.2)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>One Link. Infinite Joy.</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Get a unique URL for your event that looks stunning on any device. Track RSVPs and manage everything from your dashboard.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" 
            alt="Event" 
            style={{ width: '100%', borderRadius: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '5rem 5%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#6366f1', marginBottom: '1rem' }}>KKDesign</div>
        <p style={{ color: '#64748b' }}>© 2026 KKDesign Platform. All celebrations managed.</p>
      </footer>
    </div>
  );
};

export default Landing;
