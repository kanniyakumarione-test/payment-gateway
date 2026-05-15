import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Loader2, CheckCircle2, XCircle, Clock, ExternalLink, User, Wallet, ArrowDownCircle } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import LoadingScreen from '../components/LoadingScreen';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'payouts'
  const { showToast } = useToast();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [txRes, payRes] = await Promise.all([
        api.get('/admin/transactions'),
        api.get('/admin/payouts')
      ]);
      setTransactions(txRes.data.transactions);
      setPayouts(payRes.data.payouts);
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
      await api.patch(`/payments/status/${id}`, { status });
      showToast(`Global: Transaction ${status}ed`);
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdatePayoutStatus = async (id, status) => {
    try {
      await api.patch(`/payouts/status/${id}`, { status });
      showToast(`Global: Payout ${status}ed`);
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update payout', 'error');
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
        <button 
          onClick={() => setActiveTab('transactions')}
          style={{ 
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer',
            background: activeTab === 'transactions' ? 'var(--primary)' : 'white',
            color: activeTab === 'transactions' ? 'white' : '#64748b'
          }}
        >
          Transactions
        </button>
        <button 
          onClick={() => setActiveTab('payouts')}
          style={{ 
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer',
            background: activeTab === 'payouts' ? 'var(--primary)' : 'white',
            color: activeTab === 'payouts' ? 'white' : '#64748b'
          }}
        >
          Payout Requests
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '4rem' }}>
              <LoadingScreen />
            </div>
          ) : activeTab === 'transactions' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Merchant</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>UTR / Ref</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>ID: {tx.merchant_id.slice(0, 8)}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{tx.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{tx.utr_number || '---'}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tx.status === 'Success' ? '#10b981' : '#64748b' }}>{tx.status}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleUpdateTxStatus(tx.id, 'Success')} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #10b981', color: '#10b981', background: 'white', cursor: 'pointer' }}>
                          <CheckCircle2 size={14} />
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
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Merchant</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Bank Details</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>#{p.merchant_id.slice(0, 8)}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: 600 }}>{p.bank_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.account_number}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: p.status === 'Paid' ? '#10b981' : '#f59e0b' }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {p.status === 'Pending' && (
                        <button 
                          onClick={() => handleUpdatePayoutStatus(p.id, 'Paid')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                        >
                          <ArrowDownCircle size={14} /> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
