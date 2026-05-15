import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, User, Phone, FileText, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { useToast } from '../context/ToastContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Wedding',
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    host_name: '',
    contact_number: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please login to create an event');

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          user_id: user.uid
        }])
        .select()
        .single();

      if (error) throw error;

      showToast('Invitation Created Successfully! ✨');
      navigate(`/dashboard/my-invites`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1a1a1a' }}>Create New Invitation</h1>
        <p style={{ color: '#64748b' }}>Enter the details for your special celebration.</p>
      </div>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a1a1a' }}>Event Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none', fontWeight: 600 }}
            >
              <option value="Wedding">💍 Wedding</option>
              <option value="Birthday">🎂 Birthday</option>
              <option value="Anniversary">💖 Anniversary</option>
              <option value="House Warming">🏠 House Warming</option>
              <option value="Inauguration">🎊 Inauguration</option>
              <option value="Party">🎉 Party</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Event Title</label>
            <div style={{ position: 'relative' }}>
              <Sparkles size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ff6b6b' }} />
              <input 
                type="text" 
                required
                placeholder="e.g. Roshinth's 21st Birthday Gala"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Event Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="date" 
                required
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Event Time</label>
            <div style={{ position: 'relative' }}>
              <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                required
                placeholder="e.g. 6:30 PM onwards"
                value={formData.event_time}
                onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Venue Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                required
                placeholder="Enter full venue address"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Host Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                required
                placeholder="Who is hosting?"
                value={formData.host_name}
                onChange={(e) => setFormData({...formData, host_name: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Contact Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                required
                placeholder="For RSVP / Queries"
                value={formData.contact_number}
                onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Event Description</label>
            <textarea 
              placeholder="Tell your guests more about the event..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none', minHeight: '100px', resize: 'none' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button 
              disabled={loading}
              type="submit"
              style={{ width: '100%', padding: '1.25rem', background: '#1a1a1a', color: 'white', borderRadius: '1.25rem', fontWeight: 800, fontSize: '1.125rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Create Invitation <ChevronRight size={20} /></>}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateEvent;
