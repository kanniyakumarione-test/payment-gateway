import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Search, Loader2, CheckCircle2, XCircle, Clock, 
  ExternalLink, User, Wallet, ArrowDownCircle, Lock, Unlock, Users, Trash2 
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
      const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      const { data: pays } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
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

  // GLOBAL DELETE ACTIONS
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('ADMIN: Permanent delete this transaction?')) return;
    try {
      await supabase.from('transactions').delete().eq('id', id);
      showToast('Transaction deleted globally');
      fetchAdminData();
    } catch (err) { showToast('Delete failed', 'error'); }
  };

  const handleDeletePayout = async (id) => {
    if (!window.confirm('ADMIN: Permanent delete this payout record?')) return;
    try {
      await supabase.from('payouts').delete().eq('id', id);
      showToast('Payout deleted globally');
      fetchAdminData();
    } catch (err) { showToast('Delete failed', 'error'); }
  };

  const handleDeleteMerchant = async (id) => {
    if (!window.confirm('ADMIN CRITICAL: Delete this merchant profile? All their settings will be lost.')) return;
    try {
      await supabase.from('merchants').delete().eq('id', id);
      showToast('Merchant deleted globally');
      fetchAdminData();
    } catch (err) { showToast('Delete failed', 'error'); }
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {tx.status !== 'Completed' && (
                        <button onClick={() => handleUpdateTxStatus(tx.id, 'Completed')} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #10b981', color: '#10b981', background: 'white', cursor: 'pointer' }}>
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleDeleteTransaction(tx.id)} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'payouts' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {p.status === 'Pending' && (
                        <button onClick={() => handleUpdatePayoutStatus(p.id, 'Paid')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                          Mark Paid
                        </button>
                      )}
                      <button onClick={() => handleDeletePayout(p.id)} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Merchant Name</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>VPA</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{m.business_name || 'Unnamed Merchant'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{m.id.slice(0, 8)}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{m.upi_id || '---'}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {m.is_locked ? (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Lock size={12}/> Locked</span>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Unlock size={12}/> Open</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {m.is_locked && (
                        <button onClick={() => handleUnlockMerchant(m.id)} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #10b981', color: '#10b981', background: 'white', cursor: 'pointer' }}>
                          Unlock Bank
                        </button>
                      )}
                      <button onClick={() => handleDeleteMerchant(m.id)} title="Delete Merchant" style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
