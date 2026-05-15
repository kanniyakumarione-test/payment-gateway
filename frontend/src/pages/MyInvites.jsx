import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Gift, Eye, Share2, Trash2, Calendar, MapPin, Loader2, Sparkles, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const MyInvites = () => {
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchInvites = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (err) {
      showToast('Failed to load invitations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invitation?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      showToast('Invitation deleted successfully');
      fetchInvites();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const filteredInvites = invites.filter(invite => 
    invite.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit' }}>My Invitations</h1>
          <p style={{ color: '#64748b' }}>Manage and share your digital celebrations.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/create')}
          style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: 'white', borderRadius: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Invite
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ background: 'white', padding: '1rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={20} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search your invitations..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontWeight: 600, fontSize: '1rem' }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
      ) : filteredInvites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '2rem', border: '1px dashed #e2e8f0' }}>
          <Sparkles size={48} style={{ margin: '0 auto 1.5rem', color: '#ff6b6b', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Celebrations Found</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>You haven't created any digital invitations yet.</p>
          <button onClick={() => navigate('/dashboard/create')} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer' }}>Create First Invite</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredInvites.map((invite) => (
            <motion.div 
              key={invite.id}
              whileHover={{ y: -5 }}
              style={{ background: 'white', padding: '1.5rem', borderRadius: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', background: invite.type === 'Wedding' ? '#fff0f0' : '#f0f9ff', color: invite.type === 'Wedding' ? '#ff6b6b' : '#0ea5e9', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {invite.type === 'Wedding' ? <Heart size={28} /> : <Gift size={28} />}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => window.open(`/invite/${invite.id}`, '_blank')} title="Preview" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#64748b' }}><Eye size={18} /></button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.id}`); showToast('Link Copied! 📋'); }} title="Share Link" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#64748b' }}><Share2 size={18} /></button>
                  <button onClick={() => handleDelete(invite.id)} title="Delete" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>{invite.title}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Calendar size={16} /> {new Date(invite.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                  <MapPin size={16} /> {invite.venue.slice(0, 40)}...
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{invite.type}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff6b6b' }}>Link Active ✨</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyInvites;
