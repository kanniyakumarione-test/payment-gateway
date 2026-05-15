import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Landmark, ShieldCheck, Save, Loader2, Smartphone } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';

const Settings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Auto-lookup bank name from IFSC
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const code = bankData.ifscCode.toUpperCase();
    if (code.length === 11) {
      const fetchBankInfo = async () => {
        try {
          const res = await fetch(`https://ifsc.razorpay.com/${code}`);
          if (res.ok) {
            const data = await res.json();
            setBankData(prev => ({ ...prev, bankName: data.BANK }));
            
            // Only show toast if this isn't the first time we're loading the saved data
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

  // Set initialLoadDone to true after the first fetch from database is complete
  useEffect(() => {
    if (!fetching) {
      // Small delay to ensure the IFSC lookup effect has run for the initial data
      setTimeout(() => setInitialLoadDone(true), 1000);
    }
  }, [fetching]);

  // 3. Save to Supabase
  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      showToast('You must be logged in', 'error');
      return;
    }

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
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings: ' + err.message, 'error');
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Settings</h1>
        <p style={{ color: '#64748b' }}>Manage your business profile and payout settings.</p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Business Profile</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              This information will be displayed on your checkout page for customers to see.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Display Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. KK One Enterprise"
                  value={bankData.businessName}
                  onChange={(e) => setBankData({...bankData, businessName: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Customer Support Email</label>
                <input 
                  type="email" 
                  placeholder="support@kkone.com"
                  value={bankData.supportEmail}
                  onChange={(e) => setBankData({...bankData, supportEmail: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Bank Account</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              This account will be used for all your payouts. Please ensure the details match your official bank records.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Merchant UPI ID (VPA)</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. yourname@okaxis"
                    value={bankData.upiId}
                    onChange={(e) => setBankData({...bankData, upiId: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account Holder Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="Enter Account Holder Name"
                    value={bankData.accountHolder}
                    onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
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
                    placeholder="Enter IFSC to auto-detect bank"
                    value={bankData.bankName}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', color: '#64748b' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter Bank Account Number"
                    value={bankData.accountNumber}
                    onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>IFSC Code</label>
                  <input 
                    type="text" 
                    placeholder="E.g. HDFC0001234"
                    value={bankData.ifscCode}
                    onChange={(e) => setBankData({...bankData, ifscCode: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--accent)" />
                <p style={{ fontSize: '0.75rem', color: '#065f46', lineHeight: 1.5 }}>
                  Your bank details are encrypted and stored securely.
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: 'fit-content', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', 
                  borderRadius: '0.75rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' 
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;
