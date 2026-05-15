import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Phone, Heart, Sparkles, Loader2, Music, Gift, Share2, Map as MapIcon, ChevronDown, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper for Particles
const Particles = ({ color }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 100, 
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 200 - 100}px)`,
            rotate: 360 
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{ position: 'absolute', opacity: 0.2 }}
        >
          {i % 2 === 0 ? <Heart size={Math.random() * 20 + 10} fill={color} color={color} /> : <Star size={Math.random() * 15 + 5} color={color} fill={color} />}
        </motion.div>
      ))}
    </div>
  );
};

const EventPreview = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpData, setRsvpData] = useState({ guest_name: '', guest_count: 1, status: 'attending' });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 3D Transforms
  const cardRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 10]);
  const cardRotateY = useTransform(scrollYProgress, [0, 0.5], [0, -5]);
  const cardScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const storyScale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
        if (!data.password) setIsUnlocked(true);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event) return;
    
    const targetDate = new Date(`${event.event_date}T${event.event_time || '00:00'}`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(null); // Event has started
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <Loader2 className="animate-spin" size={48} color="#6366f1" />
    </div>
  );

  if (!event) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', textAlign: 'center', padding: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Outfit' }}>Invitation Not Found</h2>
        <p style={{ color: '#64748b' }}>The link might be broken or incorrect.</p>
      </div>
    </div>
  );

  if (event.expiry_date && new Date(event.expiry_date) < new Date(new Date().setHours(0,0,0,0))) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⌛</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Outfit' }}>Invitation Expired</h2>
          <p style={{ color: '#64748b' }}>This celebration link is no longer active.</p>
        </div>
      </div>
    );
  }

  const isWedding = event.type === 'Wedding';
  const primaryColor = isWedding ? '#ff6b6b' : '#6366f1';
  const accentColor = isWedding ? '#ffd700' : '#a855f7'; // Gold for wedding, purple for others

  if (event.password && !isUnlocked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', padding: '2rem' }}>
        <Particles color={primaryColor} />
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', padding: '3rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%', zIndex: 10 }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Private Event</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.875rem' }}>Please enter the password to view this invitation.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === event.password) {
              setIsUnlocked(true);
            } else {
              setPasswordError(true);
            }
          }}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: `2px solid ${passwordError ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', marginBottom: '1rem', textAlign: 'center', fontSize: '1rem', letterSpacing: '0.2em' }}
            />
            {passwordError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem', fontWeight: 700 }}>Incorrect password</p>}
            <button 
              type="submit" 
              style={{ width: '100%', padding: '1rem', background: primaryColor, color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
            >
              Unlock Invitation
            </button>
          </form>
        </div>
      </div>
    );
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  const getVenueDetails = (venueStr) => {
    if (!venueStr) return { address: '', mapUrl: '' };
    if (venueStr.includes(' | @')) {
      const [address, coords] = venueStr.split(' | @');
      return { 
        address, 
        mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${coords}` 
      };
    }
    return {
      address: venueStr,
      mapUrl: `https://www.google.com/maps/search/${encodeURIComponent(venueStr)}`
    };
  };

  const venueInfo = event ? getVenueDetails(event.venue) : { address: '', mapUrl: '' };

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', color: '#fff', overflowX: 'hidden', perspective: '2000px' }}>
      <Particles color={primaryColor} />
      
      {/* 1. HERO SECTION (3D Parallax Layer) */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}>
        <motion.div 
          style={{
            position: 'absolute',
            inset: -50,
            background: event.image_url ? `url(${event.image_url})` : `url(https://images.unsplash.com/photo-${isWedding ? '1519225421118-df3d51945524' : '1530103862676-de30951306f3'}?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            translateZ: '-500px',
            scale: 1.5,
          }}
        />

        <motion.div 
          style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            height: '85vh',
            position: 'relative',
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            scale: cardScale,
            zIndex: 10,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main Invitation Card Body */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'rgba(255,255,255,0.03)', 
            backdropFilter: 'blur(30px)', 
            borderRadius: '4rem', 
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem'
          }}>
            {/* Background Texture Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")', pointerEvents: 'none' }} />
            
            <motion.div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: `2px solid ${accentColor}` }}
              >
                {isWedding ? <Heart size={40} fill={primaryColor} color={primaryColor} /> : <Sparkles size={40} color={accentColor} />}
              </motion.div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.4em', color: accentColor, marginBottom: '2rem', textTransform: 'uppercase' }}>
                Join Us For The {event.type}
              </h2>

              <h1 style={{ 
                fontSize: 'clamp(3rem, 10vw, 6rem)', 
                fontWeight: 900, 
                fontFamily: 'Playfair Display, serif', 
                lineHeight: 1, 
                marginBottom: '2rem',
                background: `linear-gradient(to bottom, #fff, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                {event.title}
              </h1>

              {/* LIVE COUNTDOWN */}
              {timeLeft && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds }
                  ].map((unit, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.5rem', borderRadius: '1rem', minWidth: '80px' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>{String(unit.value).padStart(2, '0')}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{unit.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '1.5rem', color: '#94a3b8', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
                "{event.description}"
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: accentColor, marginBottom: '0.5rem', letterSpacing: '0.2em' }}>WHEN</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div style={{ opacity: 0.6 }}>at {formatTime(event.event_time)}</div>
                </div>
                <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: accentColor, marginBottom: '0.5rem', letterSpacing: '0.2em' }}>WHERE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{venueInfo.address.split(',')[0]}</div>
                  <div style={{ opacity: 0.6 }}>The Celebration Awaits</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Luxury Elements (3D Layers) */}
          <motion.div style={{ position: 'absolute', top: '-40px', right: '-40px', zIndex: 11, translateZ: '100px' }}>
             <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle at top left, ${accentColor}, transparent)`, filter: 'blur(40px)', opacity: 0.6 }} />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. GLASS-DETAILS SECTION */}
      <section style={{ padding: '10rem 5%', position: 'relative', zIndex: 12 }}>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ scale: storyScale, opacity: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}
        >
          {/* Card 1: Time */}
          <div style={{ padding: '3rem', borderRadius: '3rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: primaryColor }}>
              <Clock size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Timed Perfection</h3>
            <p style={{ color: '#94a3b8' }}>Arrival at {formatTime(event.event_time)}. We encourage everyone to be seated by the start.</p>
          </div>

          {/* Card 2: Venue */}
          <div style={{ padding: '3rem', borderRadius: '3rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#38bdf8' }}>
              <MapPin size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>The Grand Venue</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{venueInfo.address}</p>
            <button 
              onClick={() => window.open(venueInfo.mapUrl, '_blank')}
              style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '100px', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              Map Navigation
            </button>
          </div>

          {/* Card 3: Host Info */}
          <div style={{ padding: '3rem', borderRadius: '3rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#a78bfa' }}>
              <User size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Your Hosts</h3>
            <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>{event.host_name}</p>
            <p style={{ color: '#94a3b8' }}>{event.contact_number}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => window.open(`tel:${event.contact_number}`)}
                style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '100px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Phone size={16} /> Contact Host
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: event.title, text: event.description, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link Copied! 🔗');
                  }
                }}
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Share2 size={16} /> Share Link
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. DIGITAL RSVP SECTION */}
      <section style={{ padding: '5rem 5% 10rem', position: 'relative', zIndex: 12 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Digital RSVP</h2>
            <p style={{ color: '#94a3b8' }}>Kindly respond to secure your presence.</p>
          </div>

          {rsvpSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <Sparkles size={40} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.5rem' }}>Thank You!</h3>
              <p style={{ color: '#94a3b8' }}>Your response has been securely sent to the host.</p>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setRsvpLoading(true);
              try {
                const { error } = await supabase.from('rsvps').insert([{
                  event_id: id,
                  guest_name: rsvpData.guest_name,
                  guest_count: rsvpData.guest_count,
                  status: rsvpData.status
                }]);
                if (error) throw error;
                setRsvpSuccess(true);
              } catch (err) {
                alert('Failed to send RSVP. Please try again.');
              } finally {
                setRsvpLoading(false);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#cbd5e1' }}>Full Name</label>
                <input required type="text" placeholder="John Doe" value={rsvpData.guest_name} onChange={e => setRsvpData({...rsvpData, guest_name: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#cbd5e1' }}>Guests</label>
                  <select value={rsvpData.guest_count} onChange={e => setRsvpData({...rsvpData, guest_count: parseInt(e.target.value)})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', outline: 'none' }}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ color: 'black' }}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#cbd5e1' }}>Will you attend?</label>
                  <select value={rsvpData.status} onChange={e => setRsvpData({...rsvpData, status: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', outline: 'none' }}>
                    <option value="attending" style={{ color: 'black' }}>Joyfully Accepts</option>
                    <option value="declined" style={{ color: 'black' }}>Regretfully Declines</option>
                  </select>
                </div>
              </div>

              <button disabled={rsvpLoading} type="submit" style={{ marginTop: '1rem', width: '100%', padding: '1.25rem', background: primaryColor, color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                {rsvpLoading ? <Loader2 className="animate-spin" /> : 'Send RSVP'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 4. FINAL FOIL FOOTER */}
      <footer style={{ padding: '8rem 2rem', textAlign: 'center', background: 'linear-gradient(to top, rgba(99, 102, 241, 0.05), transparent)' }}>
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           style={{ maxWidth: '400px', margin: '0 auto' }}
         >
           <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: accentColor, marginBottom: '1rem' }}>KKDesign</div>
           <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Crafting Digital Legacies for Every Occasion.</p>
           <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
           <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>© 2026 KKDesign Elite Platform. All Rights Reserved.</p>
         </motion.div>
      </footer>

      {/* Luxury Border Frame (Visible on scroll) */}
      <div style={{ position: 'fixed', inset: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3.5rem', pointerEvents: 'none', zIndex: 100 }} />
    </div>
  );
};

export default EventPreview;
