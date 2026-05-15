import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Phone, Heart, Sparkles, Loader2, Music, Gift, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EventPreview = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffafb' }}>
      <Loader2 className="animate-spin" size={48} color="#ff6b6b" />
    </div>
  );

  if (!event) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Invitation Not Found</h2>
        <p style={{ color: '#64748b' }}>The link might be broken or expired.</p>
      </div>
    </div>
  );

  const isWedding = event.type === 'Wedding';

  return (
    <div style={{ minHeight: '100vh', background: isWedding ? '#fff9f9' : '#f0f9ff', color: '#1a1a1a', padding: '2rem 1rem' }}>
      {/* Decorative Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.05, background: 'url("https://www.transparenttextures.com/patterns/floral-paper.png")' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '3rem', overflow: 'hidden', boxShadow: '0 30px 60px rgba(255,107,107,0.15)', position: 'relative', zIndex: 1 }}
      >
        {/* Banner Image */}
        <div style={{ height: '300px', position: 'relative' }}>
          <img 
            src={isWedding ? "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1530103862676-fa8c91abe178?auto=format&fit=crop&q=80&w=800"} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Event"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,1))' }} />
        </div>

        <div style={{ padding: '0 3rem 4rem', textAlign: 'center', marginTop: '-3rem' }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', background: isWedding ? '#fff0f0' : '#e0f2fe', color: isWedding ? '#ff6b6b' : '#0ea5e9', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <Sparkles size={16} /> YOU'RE INVITED TO A {event.type.toUpperCase()}
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', lineHeight: 1.1, marginBottom: '1rem', color: '#1a1a1a' }}>
              {event.title}
            </h1>
            
            {event.description && (
              <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem', fontStyle: 'italic' }}>
                "{event.description}"
              </p>
            )}

            <div style={{ height: '2px', width: '60px', background: isWedding ? '#ff6b6b' : '#0ea5e9', margin: '0 auto 2.5rem', borderRadius: '2px' }} />

            {/* Event Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DATE</div>
                  <div style={{ fontWeight: 800 }}>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TIME</div>
                  <div style={{ fontWeight: 800 }}>{event.event_time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>VENUE</div>
                  <div style={{ fontWeight: 800 }}>{event.venue}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: '#fff0f0', borderRadius: '2rem', border: '2px dashed #ff6b6b' }}>
              <div style={{ fontSize: '0.875rem', color: '#ff6b6b', fontWeight: 700, marginBottom: '0.5rem' }}>HOSTED BY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{event.host_name}</div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a 
                  href={`tel:${event.contact_number}`}
                  style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#ff6b6b', borderRadius: '100px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                >
                  <Phone size={18} /> RSVP via Call
                </a>
              </div>
            </div>

            <div style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              Built with love on KKDesign
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventPreview;
