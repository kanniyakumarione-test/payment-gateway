import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Landmark, ShieldCheck, Save, Loader2, Smartphone, Lock, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';

const Settings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [bankData, setBankData] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    businessName: '',
    supportEmail: ''
  });

  // 1. Fetch existing settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('merchants')
          .select('*')
          .eq('id', user.uid)
          .single();

        if (data) {
          setBankData({
            accountHolder: data.account_holder || '',
            bankName: data.bank_name || '',
            accountNumber: data.account_number || '',
            ifscCode: data.ifsc_code || '',
            upiId: data.upi_id || '',
            businessName: data.business_name || '',
            supportEmail: data.support_email || ''
          });
          setIsLocked(data.is_locked || false);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 2. Auto-lookup bank name from IFSC
  useEffect(() => {
    const code = bankData.ifscCode?.toUpperCase() || '';
    if (code.length === 11) {
      const fetchBankInfo = async () => {
        try {
          const res = await fetch(`https://ifsc.razorpay.com/${code}`);
          if (res.ok) {
            const data = await res.json();
            setBankData(prev => ({ ...prev, bankName: data.BANK }));
            if (initialLoadDone) {
              showToast(`Auto-detected: ${data.BANK}`, 'success');
            }
          }
        } catch (err) {
          console.error('IFSC Lookup failed');
        }
      };
      fetchBankInfo();
    }
  }, [bankData.ifscCode]);

  useEffect(() => {
    if (!fetching) {
      setTimeout(() => setInitialLoadDone(true), 1000);
    }
  }, [fetching]);

  // 3. Save to Supabase + Lock
  const handleSave = async (e) => {
    e.preventDefault();
    if (isLocked) {
      showToast('Your account details are locked. Contact Admin to change.', 'error');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('merchants')
        .upsert({
          id: user.uid,
          business_name: bankData.businessName,
          support_email: bankData.supportEmail,
          upi_id: bankData.upiId,
          account_holder: bankData.accountHolder,
          bank_name: bankData.bankName,
          account_number: bankData.accountNumber,
          ifsc_code: bankData.ifscCode,
          is_locked: true, // AUTO LOCK AFTER SAVE
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setIsLocked(true);
      showToast('Settings saved and LOCKED for security.', 'success');
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Settings</h1>
          <p style={{ color: '#64748b' }}>Manage your business profile and payout settings.</p>
        </div>
        {isLocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700 }}>
            <Lock size={16} /> Account Details Locked
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Business Profile */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Business Profile</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>Public info for your customers.</p>
          </div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Business Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={bankData.businessName}
                    onChange={(e) => setBankData({...bankData, businessName: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Support Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    value={bankData.supportEmail}
                    onChange={(e) => setBankData({...bankData, supportEmail: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Account */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Bank Account</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Once saved, these details are locked for security.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', opacity: isLocked ? 0.9 : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>UPI ID (VPA)</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    disabled={isLocked}
                    placeholder="e.g. yourname@okaxis"
                    value={bankData.upiId}
                    onChange={(e) => setBankData({...bankData, upiId: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: isLocked ? '#f8fafc' : 'white' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account Holder Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    disabled={isLocked}
                    value={bankData.accountHolder}
                    onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: isLocked ? '#f8fafc' : 'white' }} 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Bank Name (Auto-detected)</label>
                <div style={{ position: 'relative' }}>
                  <Landmark size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    readOnly
                    value={bankData.bankName}
                    placeholder="Enter IFSC to detect bank"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', color: '#64748b' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account Number</label>
                  <input 
                    type="text" 
                    disabled={isLocked}
                    value={bankData.accountNumber}
                    onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: isLocked ? '#f8fafc' : 'white' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>IFSC Code</label>
                  <input 
                    type="text" 
                    disabled={isLocked}
                    value={bankData.ifscCode}
                    onChange={(e) => setBankData({...bankData, ifscCode: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: isLocked ? '#f8fafc' : 'white' }} 
                  />
                </div>
              </div>

              {isLocked ? (
                <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '0.75rem', border: '1px solid #fef3c7', display: 'flex', gap: '0.75rem' }}>
                  <AlertCircle size={20} color="#d97706" />
                  <p style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
                    Bank details are locked. Please contact <strong>kanniyakumarione@gmail.com</strong> to request an update.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', gap: '0.75rem' }}>
                    <ShieldCheck size={20} color="#10b981" />
                    <p style={{ fontSize: '0.75rem', color: '#065f46', lineHeight: 1.5 }}>
                      Your bank details are encrypted and stored securely. Once saved, they cannot be changed without admin approval.
                    </p>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{ width: 'fit-content', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Saving...' : 'Save and Lock Details'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

const UserIcon = ({ size, style }) => (
  <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default Settings;
