import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Save, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

const Settings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (user) {
        await updateProfile(user, {
          displayName: profileData.displayName
        });
        showToast('Profile updated successfully! ✨');
      }
    } catch (err) {
      showToast('Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit' }}>Account Settings</h1>
        <p style={{ color: '#64748b' }}>Manage your KKDesign profile and preferences.</p>
      </div>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                value={profileData.displayName}
                onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="email" 
                disabled
                value={profileData.email}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #f1f5f9', outline: 'none', background: '#f8fafc', color: '#94a3b8' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email cannot be changed for security.</p>
          </div>

          <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '1.25rem', border: '1px solid #dcfce7', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'white', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#166534' }}>Account Verified</div>
              <div style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.8 }}>Your KKDesign account is active and secure.</div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '1.25rem', background: '#1a1a1a', color: 'white', borderRadius: '1.25rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ff6b6b', fontWeight: 700 }}>
           KKDesign Elite Tier Member
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
