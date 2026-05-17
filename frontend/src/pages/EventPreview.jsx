import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Phone, Heart, Loader2, Music, Gift, Share2, Map as MapIcon, ChevronDown, Star, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';



const EventPreview = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpData, setRsvpData] = useState({ guest_name: '', guest_count: 1, status: 'attending', dietary_restrictions: 'None', guest_message: '' });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [isOpening, setIsOpening] = useState(false); // Envelope opening sequence
  const [isOpened, setIsOpened] = useState(false); // Main content revealed
  
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

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setIsOpened(true);
      }, 2000); // 2 seconds for envelope to fully open and letter to rise before fading screen
      return () => clearTimeout(timer);
    }
  }, [isOpening]);

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
            <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: `2px solid ${passwordError ? '#ef4444' : currentTheme.glassBorder}`, background: currentTheme.inputBg, color: currentTheme.inputText, outline: 'none', textAlign: 'center', fontSize: '1rem', letterSpacing: '0.2em' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: currentTheme.inputText, opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
    <div ref={containerRef} style={{ background: currentTheme.bg, color: currentTheme.text, overflowX: 'hidden', overflowY: isOpened ? 'auto' : 'hidden', height: isOpened ? 'auto' : '100vh', perspective: '2000px', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      


      {/* DIGITAL FROST REVEAL OVERLAY */}
      <AnimatePresence onExitComplete={() => setIsOpened(true)}>
        {!isOpening && (
          <motion.div
            key="digital-frost"
            exit={{ opacity: 0, scale: 1.1, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', 
              background: `rgba(0,0,0,0.6)`, backdropFilter: 'blur(30px)' 
            }}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))', 
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px', padding: '4rem 3rem', textAlign: 'center',
                boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                maxWidth: '500px', width: '90%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem'
              }}
            >
               <div>
                 <div style={{ fontSize: '0.875rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '1rem', fontWeight: 600 }}>Exclusive Invitation</div>
                 <h2 style={{ fontSize: '2.5rem', color: '#ffffff', fontFamily: 'Playfair Display, serif', fontWeight: 900, lineHeight: 1.2 }}>{event.title}</h2>
               </div>

               <motion.button 
                 onClick={() => setIsOpening(true)}
                 whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                 whileTap={{ scale: 0.95 }}
                 style={{ 
                   padding: '1rem 3rem', borderRadius: '100px', 
                   background: 'rgba(255,255,255,0.1)', 
                   border: '1px solid rgba(255,255,255,0.3)', 
                   color: '#ffffff', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', 
                   outline: 'none', transition: 'background 0.3s ease',
                   boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                 }}
               >
                 ENTER
               </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 100 }}
        animate={{ scale: isOpened ? 1 : 0.8, opacity: isOpened ? 1 : 0, y: isOpened ? 0 : 100 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2 }}
      >
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section style={{ height: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div 
          style={{
            position: 'absolute',
            inset: -50,
            background: event.image_url ? `url(${event.image_url})` : `url(https://images.unsplash.com/photo-${isWedding ? '1519225421118-df3d51945524' : '1530103862676-de30951306f3'}?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
            translateZ: '-200px',
            scale: 1.2,
          }}
        />
        {/* Cinematic Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, ${currentTheme.bg})` }} />

        <motion.div 
          style={{ 
            width: '100%', 
            maxWidth: '1200px', 
            padding: '2rem',
            position: 'relative',
            zIndex: 10,
            textAlign: 'center'
          }}
        >


            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isOpened ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5em', color: accentColor, marginBottom: '1rem', textTransform: 'uppercase' }}
            >
              Join Us For The {event.type}
            </motion.h2>

            <h1 style={{ 
              fontSize: 'clamp(4rem, 12vw, 8rem)', 
              fontWeight: 900, 
              fontFamily: 'Playfair Display, serif', 
              lineHeight: 1.1, 
              marginBottom: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              textShadow: theme === 'midnight' ? '0 20px 50px rgba(0,0,0,0.5)' : 'none'
            }}>
              {event.title.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-block', marginRight: '1rem', whiteSpace: 'nowrap' }}>
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={isOpened ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                      transition={{ duration: 0.8, delay: 1.5 + (wordIndex * 0.1) + (charIndex * 0.05), ease: "easeOut" }}
                      style={{ 
                        display: 'inline-block',
                        background: `linear-gradient(to bottom, ${currentTheme.text}, ${accentColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        paddingBottom: '0.2em',
                        marginBottom: '-0.2em'
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            {/* LIVE COUNTDOWN */}
            {timeLeft && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isOpened ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 2.5 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}
              >
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds }
                ].map((unit, i) => (
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.05 }}
                    key={i} 
                    style={{ background: currentTheme.glass, backdropFilter: 'blur(20px)', border: `1px solid ${currentTheme.glassBorder}`, padding: '1rem 2rem', borderRadius: '1.5rem', minWidth: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: currentTheme.text, fontFamily: 'Outfit' }}>{String(unit.value).padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{unit.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
        </motion.div>
      </section>

      {/* 2. DESCRIPTION & DETAILS (Immersive Cards) */}
      <section style={{ padding: '5rem 5% 10rem', position: 'relative', zIndex: 12 }}>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          style={{ maxWidth: '800px', margin: '0 auto 6rem', textAlign: 'center' }}
        >
            <h3 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '2rem', color: currentTheme.text }}>The Celebration</h3>
            <div style={{ fontSize: '1.5rem', color: currentTheme.text, opacity: 0.8, fontStyle: 'italic', lineHeight: 1.8 }}>
              "{event.description}"
            </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}
        >
          {/* Card 1: Time */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -15, scale: 1.02, boxShadow: `0 40px 80px rgba(0,0,0,0.4)` }}
            transition={{ duration: 0.4 }}
            style={{ padding: '4rem 3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(30px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center', cursor: 'default' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ width: '80px', height: '80px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: primaryColor, border: `1px solid ${currentTheme.glassBorder}` }}>
              <Clock size={36} />
            </motion.div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Playfair Display' }}>Date & Time</h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: accentColor }}>{new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <p style={{ opacity: 0.8, fontSize: '1.125rem' }}>Arrival at {formatTime(event.event_time)}</p>
          </motion.div>

          {/* Card 2: Venue */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -15, scale: 1.02, boxShadow: `0 40px 80px rgba(0,0,0,0.4)` }}
            transition={{ duration: 0.4 }}
            style={{ padding: '4rem 3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(30px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center', cursor: 'default' }}
          >
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ width: '80px', height: '80px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#38bdf8', border: `1px solid ${currentTheme.glassBorder}` }}>
              <MapPin size={36} />
            </motion.div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Playfair Display' }}>The Venue</h3>
            <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '2rem' }}>{venueInfo.address}</p>
            <button 
              onClick={() => window.open(venueInfo.mapUrl, '_blank')}
              style={{ padding: '1rem 2rem', background: 'transparent', border: `2px solid ${accentColor}`, borderRadius: '100px', color: currentTheme.text, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => { e.currentTarget.style.background = accentColor; e.currentTarget.style.color = currentTheme.bg; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = currentTheme.text; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Get Directions
            </button>
          </motion.div>

          {/* Card 3: Host Info */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -15, scale: 1.02, boxShadow: `0 40px 80px rgba(0,0,0,0.4)` }}
            transition={{ duration: 0.4 }}
            style={{ padding: '4rem 3rem', borderRadius: '3rem', background: currentTheme.glass, backdropFilter: 'blur(30px)', border: `1px solid ${currentTheme.glassBorder}`, textAlign: 'center', cursor: 'default' }}
          >
            <div style={{ width: '80px', height: '80px', background: currentTheme.glass, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#a78bfa', border: `1px solid ${currentTheme.glassBorder}` }}>
              <User size={36} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Playfair Display' }}>Your Hosts</h3>
            <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{event.host_name}</p>
            <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '2rem' }}>{event.contact_number}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 10, background: accentColor, color: currentTheme.bg }}
                onClick={() => window.open(`tel:${event.contact_number}`)}
                style={{ width: '50px', height: '50px', borderRadius: '50%', background: currentTheme.glass, border: `1px solid ${currentTheme.glassBorder}`, color: currentTheme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <Phone size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: -10, background: accentColor, color: currentTheme.bg }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: event.title, text: event.description, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link Copied! 🔗');
                  }
                }}
                style={{ width: '50px', height: '50px', borderRadius: '50%', background: currentTheme.glass, border: `1px solid ${currentTheme.glassBorder}`, color: currentTheme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. PREMIUM RSVP SECTION */}
      <section id="rsvp-section" style={{ padding: '5rem 5% 10rem', position: 'relative', zIndex: 12 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring" }}
          style={{ 
            maxWidth: '900px', margin: '0 auto', 
            background: currentTheme.glass, 
            backdropFilter: 'blur(40px)', 
            padding: 'clamp(1.5rem, 5vw, 4rem)', 
            borderRadius: '2rem', 
            boxShadow: `0 50px 100px rgba(0,0,0,0.4), inset 0 0 0 2px ${accentColor}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '1rem', color: accentColor }}>Digital RSVP</h2>
            <p style={{ opacity: 0.8, fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Kindly Confirm Your Attendance</p>
          </div>

          {rsvpSuccess ? (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '3rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '2rem', border: '2px solid rgba(34, 197, 94, 0.4)' }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }}>
                 
              </motion.div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#22c55e', marginBottom: '1rem', fontFamily: 'Playfair Display' }}>RSVP Confirmed</h3>
              <p style={{ opacity: 0.8, fontSize: '1.25rem' }}>Your response has been securely processed.</p>
            </motion.div>
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
            }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '0' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor }}>Guest Name</label>
                <input required type="text" placeholder="Enter full name" value={rsvpData.guest_name} onChange={e => setRsvpData({...rsvpData, guest_name: e.target.value})} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${currentTheme.glassBorder}`, color: currentTheme.text, outline: 'none', fontSize: '1.5rem', fontFamily: 'Playfair Display', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = accentColor} onBlur={(e) => e.target.style.borderColor = currentTheme.glassBorder} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor }}>Party Size</label>
                  <select value={rsvpData.guest_count} onChange={e => setRsvpData({...rsvpData, guest_count: parseInt(e.target.value)})} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${currentTheme.glassBorder}`, color: currentTheme.text, outline: 'none', fontSize: '1.5rem', fontFamily: 'Playfair Display', transition: 'border 0.3s', cursor: 'pointer' }}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ background: currentTheme.bg }}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor }}>Attendance</label>
                  <select value={rsvpData.status} onChange={e => setRsvpData({...rsvpData, status: e.target.value})} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${currentTheme.glassBorder}`, color: currentTheme.text, outline: 'none', fontSize: '1.5rem', fontFamily: 'Playfair Display', transition: 'border 0.3s', cursor: 'pointer' }}>
                    <option value="attending" style={{ background: currentTheme.bg }}>Joyfully Accepts</option>
                    <option value="declined" style={{ background: currentTheme.bg }}>Regretfully Declines</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor }}>Dietary Restrictions (Optional)</label>
                <input type="text" placeholder="e.g. Vegetarian, Nut Allergy" value={rsvpData.dietary_restrictions} onChange={e => setRsvpData({...rsvpData, dietary_restrictions: e.target.value})} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${currentTheme.glassBorder}`, color: currentTheme.text, outline: 'none', fontSize: '1.25rem', fontFamily: 'Outfit', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = accentColor} onBlur={(e) => e.target.style.borderColor = currentTheme.glassBorder} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor }}>Message for the Host (Optional)</label>
                <textarea placeholder="Can't wait to celebrate!" value={rsvpData.guest_message} onChange={e => setRsvpData({...rsvpData, guest_message: e.target.value})} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${currentTheme.glassBorder}`, color: currentTheme.text, outline: 'none', resize: 'none', minHeight: '80px', fontSize: '1.25rem', fontFamily: 'Outfit', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = accentColor} onBlur={(e) => e.target.style.borderColor = currentTheme.glassBorder} />
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${primaryColor}80` }}
                whileTap={{ scale: 0.95 }}
                disabled={rsvpLoading} type="submit" 
                style={{ marginTop: '3rem', width: '100%', padding: '1.25rem', background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, color: '#ffffff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
              >
                {rsvpLoading ? <Loader2 className="animate-spin" /> : 'Confirm Reservation'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 4. COLLABORATIVE GUEST GALLERY - Only shown after the event starts/ends */}
      {timeLeft === null && (
        <section style={{ padding: '5rem 5%', position: 'relative', zIndex: 12 }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', marginBottom: '1rem', color: accentColor }}>Memories & Gallery</h2>
              <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>The celebration may be over, but the memories last forever. Share your favorite moments and photos from the event!</p>
            </div>

          <div style={{ background: currentTheme.glass, backdropFilter: 'blur(30px)', border: `1px solid ${currentTheme.glassBorder}`, padding: '3rem', borderRadius: '3rem', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.875rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Name</label>
              <input type="text" placeholder="Who is sharing this memory?" value={uploaderName} onChange={e => setUploaderName(e.target.value)} style={{ width: '100%', padding: '1.25rem', background: currentTheme.inputBg, border: `2px solid ${currentTheme.glassBorder}`, borderRadius: '1rem', color: currentTheme.inputText, outline: 'none', fontSize: '1.125rem' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploadingPhoto ? 'not-allowed' : 'pointer', zIndex: 2 }} />
              <button disabled={uploadingPhoto} style={{ width: '100%', padding: '1.5rem', background: 'transparent', border: `2px dashed ${primaryColor}`, color: currentTheme.text, borderRadius: '1rem', fontWeight: 800, fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = currentTheme.glass; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                {uploadingPhoto ? <><Loader2 className="animate-spin" /> Uploading...</> : <>📸 Tap to Upload a Photo</>}
              </button>
            </div>
          </div>

          {photos.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
            >
              {photos.map(photo => (
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.05, y: -10, rotate: Math.random() * 4 - 2 }} 
                  transition={{ duration: 0.3 }} 
                  key={photo.id} 
                  style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', border: `4px solid ${currentTheme.glassBorder}`, background: currentTheme.glass, aspectRatio: '1', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
                >
                  <img src={photo.image_url} alt="Event Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '1rem', margin: 0, fontFamily: 'Playfair Display', fontStyle: 'italic' }}>Captured by {photo.uploaded_by_name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem', border: `2px dashed ${currentTheme.glassBorder}`, borderRadius: '3rem', background: currentTheme.glass }}>
              <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '1.25rem' }}>No photos have been shared yet. Be the first!</p>
            </div>
          )}
          </motion.div>
        </section>
      )}

      {/* FLOATING BOTTOM RSVP BUTTON */}
      {!rsvpSuccess && (
        <motion.div 
          initial={{ y: 150, x: '-50%' }} 
          animate={{ y: 0, x: '-50%' }} 
          transition={{ delay: 3, duration: 1.5, type: "spring" }}
          style={{ position: 'fixed', bottom: '2rem', left: '50%', zIndex: 50, width: '90%', maxWidth: '400px' }}
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: `0 30px 60px ${accentColor}60` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('rsvp-section').scrollIntoView({ behavior: 'smooth' })}
            style={{ width: '100%', padding: '1.25rem 2rem', background: `linear-gradient(to right, ${currentTheme.glass}, ${currentTheme.bg})`, backdropFilter: 'blur(30px)', border: `2px solid ${accentColor}`, borderRadius: '100px', color: accentColor, fontWeight: 900, fontSize: '1.125rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', cursor: 'pointer' }}
          >
             Reserve Seat
          </motion.button>
        </motion.div>
      )}

      {/* 5. FINAL FOIL FOOTER */}
      <footer style={{ padding: '8rem 2rem 10rem', textAlign: 'center', background: `linear-gradient(to top, ${currentTheme.glass}, transparent)` }}>
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           style={{ maxWidth: '400px', margin: '0 auto' }}
         >
           <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: accentColor, marginBottom: '1rem' }}>KKDesign</div>
           <p style={{ color: currentTheme.text, opacity: 0.6, fontSize: '1rem' }}>Crafting Digital Legacies for Every Occasion.</p>
           <div style={{ height: '1px', width: '100%', background: currentTheme.glassBorder, margin: '2rem 0' }} />
           <p style={{ fontSize: '0.875rem', opacity: 0.4 }}>© 2026 KKDesign Elite Platform. All Rights Reserved.</p>
         </motion.div>
      </footer>

      <div style={{ position: 'fixed', inset: '1rem', border: `1px solid ${currentTheme.glassBorder}`, borderRadius: '2rem', pointerEvents: 'none', zIndex: 100 }} />
      </motion.div>
    </div>
  );
};

export default EventPreview;
