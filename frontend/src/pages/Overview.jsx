import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, ChevronRight, Plus, Heart, MapPin, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Overview = () => {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, totalGuests: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch Events
      const { data: events } = await supabase.from('events').select('*').eq('user_id', user.uid).order('created_at', { ascending: false });
      
      if (events && events.length > 0) {
        const eventIds = events.map(e => e.id);
        
        // Fetch RSVPs for these events
        const { data: rsvps } = await supabase.from('rsvps').select('*').in('event_id', eventIds);
        
        let totalGuests = 0;
        const chartData = [];
        const typeCount = {};

        events.forEach(event => {
          // Event Type count for Pie Chart
          typeCount[event.type] = (typeCount[event.type] || 0) + 1;

          // RSVP Count for Bar Chart
          const eventRsvps = rsvps?.filter(r => r.event_id === event.id && r.status === 'attending') || [];
          const eventGuestCount = eventRsvps.reduce((acc, curr) => acc + curr.guest_count, 0);
          totalGuests += eventGuestCount;
          
          chartData.push({
            name: event.title.length > 10 ? event.title.substring(0,10) + '...' : event.title,
            guests: eventGuestCount
          });
        });

        const formattedPieData = Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] }));

        setStats({
          total: events.length,
          upcoming: events.filter(e => new Date(e.event_date) >= new Date()).length,
          totalGuests: totalGuests
        });
        setRecentEvents(events.slice(0, 3));
        setAnalyticsData(chartData.slice(0, 5)); // Top 5 recent events
        setPieData(formattedPieData);
      }
    };
    fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            Hello, {auth.currentUser?.displayName?.split(' ')[0] || 'Designer'}! 👋
          </h1>
          <p style={{ color: '#64748b' }}>Here is your celebration analytics dashboard.</p>
        </div>
        <Link to="/dashboard/create" style={{ textDecoration: 'none', background: '#6366f1', color: 'white', padding: '1rem 2rem', borderRadius: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
          <Plus size={20} /> Create New
        </Link>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Events', value: stats.total, icon: <BarChart2 />, color: '#6366f1' },
          { label: 'Upcoming Events', value: stats.upcoming, icon: <Calendar />, color: '#10b981' },
          { label: 'Total Guests Attending', value: stats.totalGuests, icon: <Users />, color: '#f59e0b' }
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '2rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
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

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Bar Chart */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} color="#6366f1" /> Guest Attendance per Event
          </h3>
          {analyticsData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="guests" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data available yet.</div>
          )}
        </div>

        {/* Pie Chart */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChartIcon size={20} color="#10b981" /> Event Types
          </h3>
          {pieData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                {pieData.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data available yet.</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Recent Invitations <ChevronRight size={20} />
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {recentEvents.length > 0 ? recentEvents.map((event) => (
            <Link key={event.id} to={`/invite/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'white', borderRadius: '2rem', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
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
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>No invitations created yet.</p>
              <Link to="/dashboard/create" style={{ color: '#6366f1', fontWeight: 800, textDecoration: 'none' }}>Start Creating Now</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;

