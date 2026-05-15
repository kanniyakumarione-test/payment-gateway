import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, MoreHorizontal, ExternalLink, Plus, Loader2 } from 'lucide-react';
import CreatePaymentModal from '../components/CreatePaymentModal';
import { fetchTransactions } from '../lib/api';

import { auth } from '../lib/firebase';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const data = await fetchTransactions(user.uid); 
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent)' };
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      case 'Failed': return { bg: 'rgba(244, 63, 94, 0.1)', text: 'var(--danger)' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Transactions</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.75rem', background: 'var(--primary)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={18} /> Create Payment
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <CreatePaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={loadTransactions} 
      />

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
            <p>Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <p>No transactions found. Create your first payment!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>ID</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Email</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Amount</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Method</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Date</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => {
                const statusStyle = getStatusColor(trx.status);
                return (
                  <tr key={trx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>#{trx.id.slice(0, 8)}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{trx.customer_email || 'N/A'}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{trx.amount.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '100px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: statusStyle.bg,
                        color: statusStyle.text
                      }}>
                        {trx.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>{trx.method}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(trx.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                          <ExternalLink size={18} />
                        </button>
                        <button style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Transactions;
