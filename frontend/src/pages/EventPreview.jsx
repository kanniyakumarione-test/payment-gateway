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
  const [rsvpData, setRsvpData] = useState({ guest_name: '', guest_count: 1, status: 'attending', dietary_restrictions: 'None', guest_message: '' });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  
  // Gallery States
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  
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

        // Fetch Gallery Photos
        const { data: photoData } = await supabase
          .from('event_photos')
          .select('*')
          .eq('event_id', id)
          .order('created_at', { ascending: false });
        
        if (photoData) setPhotos(photoData);

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

  const compressImage = (file, maxKb = 100) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800; // Limit width to 800px for smaller file sizes

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          let blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
          
          // Iteratively reduce quality until blob is under maxKb (100KB)
          while (blob.size > maxKb * 1024 && quality > 0.1) {
            quality -= 0.1;
            blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
          }
          
          resolve(blob);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!uploaderName.trim()) {
      alert("Please enter your name before uploading a photo so the host knows who to thank!");
      return;
    }

    setUploadingPhoto(true);
    try {
      // 1. Compress the image before uploading
      const compressedBlob = await compressImage(file);

      // 2. Upload to Cloudinary
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
      const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      const data = new FormData();
      data.append('file', compressedBlob, 'guest_memory.jpg');
      data.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data
      });
      
      const result = await res.json();
      if (!result.secure_url) throw new Error('Upload failed');

      const newPhoto = {
        event_id: id,
        image_url: result.secure_url,
        uploaded_by_name: uploaderName
      };

      const { data: insertedData, error } = await supabase
        .from('event_photos')
        .insert([newPhoto])
        .select();

      if (error) throw error;
      setPhotos([insertedData[0], ...photos]);
      alert("Photo added to the gallery! 📸");
    } catch (err) {
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

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
  const theme = event.theme || 'midnight';
  
  // Theme Configuration
  const themeConfig = {
    midnight: {
      bg: '#0a0a0a',
      text: '#ffffff',
      primary: isWedding ? '#ff6b6b' : '#6366f1',
      accent: isWedding ? '#ffd700' : '#a855f7',
      glass: 'rgba(255,255,255,0.03)',
      glassBorder: 'rgba(255,255,255,0.1)',
      inputBg: 'rgba(0,0,0,0.5)',
      inputText: '#ffffff'
    },
    classic: {
      bg: '#fdfbf7',
      text: '#1a1a1a',
      primary: isWedding ? '#d4af37' : '#1e3a8a',
      accent: isWedding ? '#b8860b' : '#3b82f6',
      glass: 'rgba(255,255,255,0.7)',
      glassBorder: 'rgba(0,0,0,0.05)',
      inputBg: 'rgba(255,255,255,0.8)',
      inputText: '#1a1a1a'
    },
    floral: {
      bg: '#fff0f5',
      text: '#4a0e2e',
      primary: '#ff69b4',
      accent: '#ff1493',
      glass: 'rgba(255,255,255,0.6)',
      glassBorder: 'rgba(255,105,180,0.2)',
      inputBg: 'rgba(255,255,255,0.9)',
      inputText: '#4a0e2e'
    },
    minimal: {
      bg: '#ffffff',
      text: '#000000',
      primary: '#000000',
      accent: '#666666',
      glass: 'rgba(240,240,240,0.8)',
      glassBorder: 'rgba(0,0,0,0.1)',
      inputBg: '#f8f8f8',
      inputText: '#000000'
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.midnight;
  const primaryColor = currentTheme.primary;
  const accentColor = currentTheme.accent;

  if (event.password && !isUnlocked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentTheme.bg, color: currentTheme.text, padding: '2rem' }}>
        <Particles color={primaryColor} />
        <div style={{ background: currentTheme.glass, backdropFilter: 'blur(20px)', padding: '3rem', borderRadius: '2rem', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center', maxWidth: '400px', width: '100%', zIndex: 10 }}>
          <div style={{ width: '60px', height: '60px', background: currentTheme.glass, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
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
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: `2px solid ${passwordError ? '#ef4444' : currentTheme.glassBorder}`, background: currentTheme.inputBg, color: currentTheme.inputText, outline: 'none', marginBottom: '1rem', textAlign: 'center', fontSize: '1rem', letterSpacing: '0.2em' }}
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
    <div ref={containerRef} style={{ background: currentTheme.bg, color: currentTheme.text, overflowX: 'hidden', perspective: '2000px', minHeight: '100vh' }}>
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
            background: currentTheme.glass, 
            backdropFilter: 'blur(30px)', 
            borderRadius: '4rem', 
            border: `1px solid ${currentTheme.glassBorder}`,
            overflow: 'hidden',
            boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem'
          }}>
            {/* Background Texture Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: theme === 'midnight' ? 0.1 : 0.4, backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")', pointerEvents: 'none' }} />
            
            <motion.div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ width: '80px', height: '80px', background: currentTheme.glass, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: `2px solid ${accentColor}` }}
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
                background: `linear-gradient(to bottom, ${currentTheme.text}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: theme === 'midnight' ? '0 20px 40px rgba(0,0,0,0.3)' : 'none'
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
                    <div key={i} style={{ background: currentTheme.glass, backdropFilter: 'blur(10px)', border: `1px solid ${currentTheme.glassBorder}`, padding: '0.75rem 1.5rem', borderRadius: '1rem', minWidth: '80px' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: currentTheme.text }}>{String(unit.value).padStart(2, '0')}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{unit.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '1.5rem', color: currentTheme.text, opacity: 0.8, fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
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
          <div style={{ padding: '3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: primaryColor }}>
              <Clock size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Timed Perfection</h3>
            <p style={{ color: '#94a3b8' }}>Arrival at {formatTime(event.event_time)}. We encourage everyone to be seated by the start.</p>
          </div>

          {/* Card 2: Venue */}
          <div style={{ padding: '3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#38bdf8' }}>
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
          <div style={{ padding: '3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#a78bfa' }}>
              <User size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Your Hosts</h3>
            <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>{event.host_name}</p>
            <p style={{ opacity: 0.8 }}>{event.contact_number}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => window.open(`tel:${event.contact_number}`)}
                style={{ padding: '0.75rem 1.5rem', background: currentTheme.glass, border: 'none', borderRadius: '100px', color: currentTheme.text, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
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
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '100px', color: currentTheme.text, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Share2 size={16} /> Share Link
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. DIGITAL RSVP SECTION */}
      <section style={{ padding: '5rem 5% 10rem', position: 'relative', zIndex: 12 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, padding: '3rem', borderRadius: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Digital RSVP</h2>
            <p style={{ opacity: 0.8 }}>Kindly respond to secure your presence.</p>
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
                  status: rsvpData.status,
                  dietary_restrictions: rsvpData.dietary_restrictions,
                  guest_message: rsvpData.guest_message
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Full Name</label>
                <input required type="text" placeholder="John Doe" value={rsvpData.guest_name} onChange={e => setRsvpData({...rsvpData, guest_name: e.target.value})} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Guests</label>
                  <select value={rsvpData.guest_count} onChange={e => setRsvpData({...rsvpData, guest_count: parseInt(e.target.value)})} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none' }}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ color: currentTheme.text === '#ffffff' ? 'black' : 'black' }}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Will you attend?</label>
                  <select value={rsvpData.status} onChange={e => setRsvpData({...rsvpData, status: e.target.value})} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none' }}>
                    <option value="attending" style={{ color: currentTheme.text === '#ffffff' ? 'black' : 'black' }}>Joyfully Accepts</option>
                    <option value="declined" style={{ color: currentTheme.text === '#ffffff' ? 'black' : 'black' }}>Regretfully Declines</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Dietary Restrictions (Optional)</label>
                <input type="text" placeholder="e.g. Vegetarian, Nut Allergy" value={rsvpData.dietary_restrictions} onChange={e => setRsvpData({...rsvpData, dietary_restrictions: e.target.value})} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Message for the Host (Optional)</label>
                <textarea placeholder="Can't wait to celebrate!" value={rsvpData.guest_message} onChange={e => setRsvpData({...rsvpData, guest_message: e.target.value})} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none', resize: 'none', minHeight: '80px' }} />
              </div>

              <button disabled={rsvpLoading} type="submit" style={{ marginTop: '1rem', width: '100%', padding: '1.25rem', background: primaryColor, color: currentTheme.text === '#000000' ? '#ffffff' : '#ffffff', border: 'none', borderRadius: '1rem', fontWeight: 800, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                {rsvpLoading ? <Loader2 className="animate-spin" /> : 'Send RSVP'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 4. COLLABORATIVE GUEST GALLERY */}
      <section style={{ padding: '5rem 5%', position: 'relative', zIndex: 12 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Memories & Gallery</h2>
            <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>Share your favorite moments from the celebration. Upload photos directly from your phone to add to the host's digital album.</p>
          </div>

          <div style={{ background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, padding: '2rem', borderRadius: '2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem', opacity: 0.8 }}>Your Name</label>
              <input type="text" placeholder="Who is sharing this memory?" value={uploaderName} onChange={e => setUploaderName(e.target.value)} style={{ width: '100%', padding: '1rem', background: currentTheme.inputBg, border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploadingPhoto ? 'not-allowed' : 'pointer', zIndex: 2 }} />
              <button disabled={uploadingPhoto} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: `2px dashed ${primaryColor}`, color: currentTheme.text, borderRadius: '1rem', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {uploadingPhoto ? <><Loader2 className="animate-spin" /> Uploading...</> : <>📸 Tap to Upload a Photo</>}
              </button>
            </div>
          </div>

          {photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', border: `1px solid ${currentTheme.glassBorder}`, background: currentTheme.glass, aspectRatio: '1' }}>
                  <img src={photo.image_url} alt="Event Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>By {photo.uploaded_by_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', border: `2px dashed ${currentTheme.glassBorder}`, borderRadius: '2rem' }}>
              <p style={{ opacity: 0.5, fontStyle: 'italic' }}>No photos have been shared yet. Be the first!</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. FINAL FOIL FOOTER */}
      <footer style={{ padding: '8rem 2rem', textAlign: 'center', background: `linear-gradient(to top, ${currentTheme.glass}, transparent)` }}>
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
