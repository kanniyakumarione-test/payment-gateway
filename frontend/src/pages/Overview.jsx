import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, Share2, ChevronRight, Plus, Heart, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';

const Overview = () => {
  const [stats, setStats] = useState({ total: 0, upcoming: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const { data } = await supabase.from('events').select('*').eq('user_id', user.uid).order('created_at', { ascending: false });
      if (data) {
        setStats({
          total: data.length,
          upcoming: data.filter(e => new Date(e.event_date) >= new Date()).length
        });
        setRecentEvents(data.slice(0, 3));
      }
    };
    fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            Hello, {auth.currentUser?.displayName?.split(' ')[0] || 'Designer'}! 👋
          </h1>
          <p style={{ color: '#64748b' }}>Ready to create some magic today?</p>
        </div>
        <Link to="/dashboard/create" style={{ textDecoration: 'none', background: '#6366f1', color: 'white', padding: '1rem 2rem', borderRadius: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
          <Plus size={20} /> Create New
        </Link>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Events', value: stats.total, icon: <Sparkles />, color: '#6366f1' },
          { label: 'Upcoming', value: stats.upcoming, icon: <Calendar />, color: '#10b981' },
          { label: 'Guests Tracked', value: '0', icon: <Users />, color: '#f59e0b' }
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '2rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: `${stat.color}15`, color: stat.color, borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Recent Invitations <ChevronRight size={20} />
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {recentEvents.length > 0 ? recentEvents.map((event) => (
            <Link key={event.id} to={`/invite/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'white', borderRadius: '2rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ height: '120px', background: `linear-gradient(135deg, #6366f1 0%, #a855f7 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Heart size={48} color="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)" />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.125rem' }}>{event.title}</h3>
                    <div style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{event.type}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {new Date(event.event_date).toLocaleDateString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {event.venue.substring(0, 30)}...</div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )) : (
            <div style={{ gridColumn: 'span 3', padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '2rem', border: '2px dashed #e2e8f0' }}>
              <p style={{ color: '#64748b' }}>No invitations created yet.</p>
              <Link to="/dashboard/create" style={{ color: '#6366f1', fontWeight: 800, textDecoration: 'none' }}>Start Creating Now</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;
