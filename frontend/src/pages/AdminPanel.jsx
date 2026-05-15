import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Search, Loader2, CheckCircle2, XCircle, Clock, 
  ExternalLink, User, Wallet, ArrowDownCircle, Lock, Unlock, Users 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import LoadingScreen from '../components/LoadingScreen';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions', 'payouts', or 'merchants'
  const { showToast } = useToast();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Transactions
      const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      // 2. Fetch Payouts
      const { data: pays } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
      // 3. Fetch Merchants
      const { data: merchs } = await supabase.from('merchants').select('*').order('updated_at', { ascending: false });

      setTransactions(txs || []);
      setPayouts(pays || []);
      setMerchants(merchs || []);
    } catch (err) {
      showToast('Admin: Failed to load global data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateTxStatus = async (id, status) => {
    try {
      await supabase.from('transactions').update({ status }).eq('id', id);
      showToast(`Transaction marked as ${status}`);
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdatePayoutStatus = async (id, status) => {
    try {
      await supabase.from('payouts').update({ status }).eq('id', id);
      showToast(`Payout marked as ${status}`);
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update payout', 'error');
    }
  };

  const handleUnlockMerchant = async (merchantId) => {
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ is_locked: false })
        .eq('id', merchantId);
      
      if (error) throw error;
      showToast('Merchant bank details UNLOCKED successfully');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to unlock merchant', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={32} color="var(--primary)" /> Super Admin Panel
        </h1>
        <p style={{ color: '#64748b' }}>Master control for all KKPay merchants and operations.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['transactions', 'payouts', 'merchants'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 700, cursor: 'pointer',
              background: activeTab === tab ? 'var(--primary)' : 'white',
              color: activeTab === tab ? 'white' : '#64748b',
              textTransform: 'capitalize',
              boxShadow: activeTab === tab ? '0 10px 15px -3px rgba(99, 102, 241, 0.2)' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem' }}>
            <LoadingScreen />
          </div>
        ) : activeTab === 'transactions' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Merchant ID</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>#{tx.merchant_id.slice(0, 8)}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{tx.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tx.status === 'Completed' ? '#10b981' : '#64748b' }}>{tx.status}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {tx.status !== 'Completed' && (
                      <button onClick={() => handleUpdateTxStatus(tx.id, 'Completed')} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #10b981', color: '#10b981', background: 'white', cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'payouts' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            {/* Payouts Table Content... */}
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Merchant</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Bank</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>#{p.merchant_id.slice(0, 8)}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>{p.bank_name}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {p.status === 'Pending' && (
                      <button onClick={() => handleUpdatePayoutStatus(p.id, 'Paid')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* MERCHANTS TAB - NEW */
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Business Name</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Bank Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Bank Details</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {merchants.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No merchants found.</td></tr>
              ) : (
                merchants.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{m.business_name || 'Unnamed Business'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {m.id.slice(0, 12)}...</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {m.is_locked ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontSize: '0.75rem', fontWeight: 700, background: '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '100px', width: 'fit-content' }}>
                          <Lock size={12} /> LOCKED
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, background: '#f0fdf4', padding: '0.25rem 0.75rem', borderRadius: '100px', width: 'fit-content' }}>
                          <Unlock size={12} /> OPEN
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ color: '#64748b' }}>{m.bank_name || 'No Bank'}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{m.account_number || '---'}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {m.is_locked && (
                        <button 
                          onClick={() => handleUnlockMerchant(m.id)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
                            borderRadius: '0.5rem', border: '1px solid var(--primary)', 
                            color: 'var(--primary)', background: 'white', fontWeight: 600, cursor: 'pointer' 
                          }}
                        >
                          <Unlock size={14} /> Release Lock
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
