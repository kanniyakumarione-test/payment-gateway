import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, History, Download, Clock, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import api from '../lib/api';
import WithdrawModal from '../components/WithdrawModal';
import LoadingScreen from '../components/LoadingScreen';

const Payouts = () => {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    available: 0,
    lastPayout: 0,
    pending: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payouts/list');
      const list = response.data.payouts;
      setPayouts(list);

      // Calculate simple stats
      const pending = list.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
      const successful = list.filter(p => p.status === 'Paid');
      const last = successful.length > 0 ? successful[0].amount : 0;

      // In real app, fetch real balance from a ledger table
      setStats({
        available: 25400.00, // Mock available balance
        lastPayout: last,
        pending: pending
      });
    } catch (err) {
      console.error('Error fetching payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { label: 'Available for Payout', value: `\u20B9${stats.available.toLocaleString()}`, icon: <Wallet color="var(--primary)" /> },
    { label: 'Last Payout', value: `\u20B9${stats.lastPayout.toLocaleString()}`, icon: <CheckCircle2 color="var(--accent)" /> },
    { label: 'Pending Payouts', value: `\u20B9${stats.pending.toLocaleString()}`, icon: <Clock color="#f59e0b" /> },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      case 'Failed': return { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Payouts</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', 
            borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <ArrowUpRight size={18} /> Withdraw Funds
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem', width: 'fit-content', marginBottom: '1rem' }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Payout History</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '4rem' }}>
            <LoadingScreen />
          </div>
        ) : payouts.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <p>No payout history found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Bank Account</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Amount</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                const style = getStatusStyle(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: 700 }}>{p.bank_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.account_number}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: style.bg, color: style.color }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <WithdrawModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchData}
        balance={stats.available}
      />
    </motion.div>
  );
};

export default Payouts;
