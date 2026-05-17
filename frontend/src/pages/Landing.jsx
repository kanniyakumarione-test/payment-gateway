import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Gift, PartyPopper, ChevronRight } from 'lucide-react';
import Logo from '../components/Logo';
import FlamesGame from '../components/FlamesGame';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      color: '#0f172a', 
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Premium Ambient Background Blobs */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.03) 50%, rgba(255,255,255,0) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(244,63,94,0.05) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.25rem 8%', 
        position: 'fixed', 
        width: '100%', 
        top: 0, 
        background: 'rgba(255, 255, 255, 0.75)', 
        backdropFilter: 'blur(20px) saturate(180%)', 
        borderBottom: '1px solid rgba(241, 245, 249, 0.8)',
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)'
      }}>
        <Logo size={36} />
        <motion.button 
          whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          style={{ 
            padding: '0.75rem 1.75rem', 
            background: '#0f172a', 
            color: 'white', 
            borderRadius: '100px', 
            fontWeight: 700, 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            letterSpacing: '-0.01em',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            transition: 'background-color 0.2s ease'
          }}
        >
          Get Started
        </motion.button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '9rem 8% 6rem', 
        textAlign: 'center', 
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Elite Invitation Platform Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.5rem 1.25rem', 
            background: 'rgba(99, 102, 241, 0.06)', 
            border: '1px solid rgba(99, 102, 241, 0.15)',
            color: '#6366f1', 
            borderRadius: '100px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.02)'
          }}>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'inline-block'
              }}
            />
            The Elite Invitation Platform
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.75rem, 7.5vw, 4.75rem)', 
            fontWeight: 900, 
            fontFamily: 'Outfit, sans-serif', 
            lineHeight: 1.15, 
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem', 
            maxWidth: '900px', 
            margin: '0 auto 1.75rem' 
          }}>
            Celebrate Moments, <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Share the Magic.
            </span>
          </h1>

          <p style={{ 
            fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)', 
            color: '#475569', 
            maxWidth: '650px', 
            margin: '0 auto 3rem', 
            lineHeight: 1.75,
            fontWeight: 400
          }}>
            Create breathtaking digital invitations for weddings, birthdays, and parties in seconds. Beautiful, responsive, and elite.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <motion.button 
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)' 
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              style={{ 
                padding: '1.25rem 2.75rem', 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)', 
                color: 'white', 
                borderRadius: '1.25rem', 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.2)'
              }}
            >
              Start Creating 
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ChevronRight size={20} />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem', 
          marginTop: '7rem', 
          maxWidth: '1200px', 
          margin: '7rem auto 0' 
        }}>
          {[
            { 
              icon: <Heart size={24} />, 
              title: 'Weddings', 
              desc: 'Elegant themes for your most special day.',
              color: '#f43f5e',
              iconBg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(244, 63, 94, 0.02) 100%)',
              borderColor: 'rgba(244, 63, 94, 0.15)'
            },
            { 
              icon: <Gift size={24} />, 
              title: 'Birthdays', 
              desc: 'Fun and vibrant designs for all ages.',
              color: '#10b981',
              iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.15)'
            },
            { 
              icon: <PartyPopper size={24} />, 
              title: 'Events', 
              desc: 'Professional gala and corporate invites.',
              color: '#f59e0b',
              iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)',
              borderColor: 'rgba(245, 158, 11, 0.15)'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: '0 30px 60px rgba(99, 102, 241, 0.06)',
                borderColor: 'rgba(99, 102, 241, 0.12)'
              }}
              style={{ 
                padding: '3rem 2.5rem', 
                background: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(20px)',
                borderRadius: '2.25rem', 
                border: '1px solid rgba(255, 255, 255, 0.6)', 
                textAlign: 'left', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Subtle top indicator bar on hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, ${item.color}, transparent)`,
                opacity: 0.7
              }} />

              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: item.iconBg, 
                border: `1px solid ${item.borderColor}`,
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '2rem',
                color: item.color
              }}>
                {item.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                fontFamily: 'Outfit, sans-serif',
                color: '#0f172a',
                marginBottom: '0.85rem' 
              }}>{item.title}</h3>
              <p style={{ 
                color: '#475569', 
                lineHeight: 1.65,
                fontSize: '1rem'
              }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section style={{ 
        padding: '6rem 8% 8rem', 
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          background: 'linear-gradient(145deg, #0b071a 0%, #0f172a 100%)', 
          borderRadius: '3.5rem', 
          padding: '5rem 4rem 4rem', 
          color: 'white', 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Ambient Glowing Orbs Inside Dark Card */}
          <div style={{ 
            position: 'absolute', 
            top: '-150px', 
            right: '-150px', 
            width: '450px', 
            height: '450px', 
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)', 
            borderRadius: '50%', 
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: '-150px', 
            left: '-150px', 
            width: '450px', 
            height: '450px', 
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0) 70%)', 
            borderRadius: '50%', 
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 800, 
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            One Link. Infinite Joy.
          </h2>

          <p style={{ 
            color: '#94a3b8', 
            fontSize: '1.125rem', 
            lineHeight: 1.75,
            marginBottom: '4rem', 
            maxWidth: '650px', 
            margin: '0 auto 4rem' 
          }}>
            Get a unique URL for your event that looks stunning on any device. Track RSVPs and manage everything from your dashboard.
          </p>

          {/* Premium Device Mockup with CSS Glass Frame */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '2rem',
              padding: '12px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Mockup Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '6px',
              padding: '0 8px 12px 4px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '12px'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
              <div style={{ 
                margin: '0 auto',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                height: '18px',
                width: '260px',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace'
              }}>
                invitation.kanniyakumarione.com/my-event
              </div>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" 
              alt="Event Preview" 
              style={{ 
                width: '100%', 
                borderRadius: '1.25rem', 
                display: 'block'
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Interactive Flames Game widget with custom theme */}
      <FlamesGame
        theme={{
          glass: 'rgba(255, 255, 255, 0.8)',
          glassBorder: 'rgba(99, 102, 241, 0.1)',
          text: '#0f172a',
          inputBg: '#ffffff',
          inputText: '#0f172a',
          primary: '#6366f1',
        }}
      />

      {/* Footer */}
      <footer style={{ 
        padding: '5rem 8% 4rem', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(241, 245, 249, 0.8)',
        background: '#ffffff',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <Logo size={32} />
        </div>
        <p style={{ 
          color: '#64748b',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          © 2026 KKDesign Platform. All celebrations managed.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
