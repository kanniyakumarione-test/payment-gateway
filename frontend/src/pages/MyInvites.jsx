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
  const [activeQrCode, setActiveQrCode] = useState(null); // stores the invite object
  const [activeRsvpEvent, setActiveRsvpEvent] = useState(null);
  const [rsvpList, setRsvpList] = useState([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
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

  const fetchRsvps = async (invite) => {
    setActiveRsvpEvent(invite);
    setLoadingRsvps(true);
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', invite.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRsvpList(data || []);
    } catch (err) {
      showToast('Failed to fetch RSVPs', 'error');
    } finally {
      setLoadingRsvps(false);
    }
  };

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
                  <button onClick={() => fetchRsvps(invite)} title="View RSVPs" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#6366f1' }}><Heart size={18} /></button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.id}`); showToast('Link Copied! 📋'); }} title="Share Link" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#64748b' }}><Share2 size={18} /></button>
                  <button onClick={() => setActiveQrCode(invite)} title="Get QR Code" style={{ padding: '0.625rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', color: '#10b981' }}><Sparkles size={18} /></button>
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

      {/* QR Code Modal */}
      {activeQrCode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '3rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <button onClick={() => setActiveQrCode(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Printable QR Code</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Guests can scan this code to open the invitation instantly.</p>
            
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #cbd5e1', display: 'inline-block', marginBottom: '2rem' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/invite/${activeQrCode.id}`)}`} 
                alt="Invitation QR Code" 
                style={{ width: '200px', height: '200px', borderRadius: '0.5rem' }}
              />
            </div>

            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${window.location.origin}/invite/${activeQrCode.id}`)}`;
                link.download = `QR_${activeQrCode.title}.png`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{ width: '100%', padding: '1rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Download High-Res QR
            </button>
          </motion.div>
        </div>
      )}

      {/* RSVP Modal */}
      {activeRsvpEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', maxWidth: '600px', width: '100%', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setActiveRsvpEvent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', paddingRight: '2rem' }}>Guest List: {activeRsvpEvent.title}</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '1rem', flex: 1 }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a' }}>
                  {rsvpList.filter(r => r.status === 'attending').reduce((acc, curr) => acc + curr.guest_count, 0)}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Attending</div>
              </div>
              <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '1rem', flex: 1 }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>
                  {rsvpList.filter(r => r.status === 'declined').reduce((acc, curr) => acc + curr.guest_count, 0)}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>Declined</div>
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {loadingRsvps ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={32} color="#6366f1" style={{ margin: '0 auto' }} /></div>
              ) : rsvpList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No RSVPs received yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {rsvpList.map(rsvp => (
                    <div key={rsvp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{rsvp.guest_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{new Date(rsvp.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.25rem 0.75rem', background: 'white', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700 }}>
                          {rsvp.guest_count} {rsvp.guest_count === 1 ? 'Guest' : 'Guests'}
                        </div>
                        <div style={{ padding: '0.25rem 0.75rem', background: rsvp.status === 'attending' ? '#dcfce7' : '#fee2e2', color: rsvp.status === 'attending' ? '#16a34a' : '#dc2626', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {rsvp.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyInvites;
