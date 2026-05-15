import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Calendar, Sparkles, Share2, Eye, ChevronRight, Gift, PartyPopper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import LoadingScreen from '../components/LoadingScreen';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    weddings: 0,
    birthdays: 0
  });
  const [recentInvites, setRecentInvites] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (events) {
          setStats({
            total: events.length,
            weddings: events.filter(e => e.type === 'Wedding').length,
            birthdays: events.filter(e => e.type === 'Birthday').length
          });
          setRecentInvites(events.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit' }}>Welcome back, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}! ✨</h1>
          <p style={{ color: '#64748b' }}>Ready to create some more magic today?</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/create')}
          style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: 'white', borderRadius: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Invitation
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#fff0f0', color: '#ff6b6b', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={24} fill="currentColor" /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Total Invites</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.total}</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#f0f9ff', color: '#0ea5e9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gift size={24} /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Weddings</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.weddings}</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#f0fdf4', color: '#22c55e', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PartyPopper size={24} /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Birthdays</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.birthdays}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Invites */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Invitations</h3>
            <button onClick={() => navigate('/dashboard/my-invites')} style={{ color: 'var(--primary)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View All <ChevronRight size={16} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentInvites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <Sparkles size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>No invitations created yet. Start with your first one!</p>
              </div>
            ) : recentInvites.map((invite) => (
              <div key={invite.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: invite.type === 'Wedding' ? '#ff6b6b' : '#0ea5e9' }}>
                  {invite.type === 'Wedding' ? <Heart size={24} /> : <Gift size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>{invite.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(invite.event_date).toLocaleDateString()} • {invite.venue.slice(0, 30)}...</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => window.open(`/invite/${invite.id}`, '_blank')} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Eye size={16} /></button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.id}`); showToast('Link Copied!'); }} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Share2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '2rem', color: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Pro Tips 💡</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#ff6b6b', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>Add a heartfelt description to make your wedding invite more personal.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#4ecdc4', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>Share your unique link via WhatsApp or Instagram for instant RSVPs.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#ffe66d', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>Use clear venue details so guests can easily find your celebration.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
