import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Download, MoreVertical, Loader2, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import CreatePaymentModal from '../components/CreatePaymentModal';
import LoadingScreen from '../components/LoadingScreen';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { showToast } = useToast();

  const fetchTransactionsData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/list');
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      showToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/payments/status/${id}`, { status });
      showToast(`Transaction ${status}ed successfully`);
      fetchTransactionsData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Logic for search and filter
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.utr_number && tx.utr_number.includes(searchTerm)) ||
      tx.amount.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'All' || tx.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Success':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', icon: <CheckCircle2 size={14} /> };
      case 'Pending Verification':
        return { bg: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', icon: <Clock size={14} /> };
      case 'Awaiting Payment':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', icon: <Clock size={14} /> };
      case 'Rejected':
        return { bg: 'rgba(244, 63, 94, 0.1)', color: '#e11d48', icon: <XCircle size={14} /> };
      default:
        return { bg: '#f1f5f9', color: '#64748b', icon: <Clock size={14} /> };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Transactions</h1>
          <p style={{ color: '#64748b' }}>Monitor and verify your incoming payments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', 
            borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Plus size={18} /> Create Payment
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by email, UTR, or amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.625rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, outline: 'none' }}
          >
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Awaiting Payment">Awaiting Payment</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button style={{ padding: '0.625rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '4rem' }}>
              <LoadingScreen />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              No transactions matching your criteria.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Customer / ID</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Amount</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>UTR / Ref</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const style = getStatusStyle(tx.status);
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{tx.customer_email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{tx.id.slice(0, 8)}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{tx.amount.toLocaleString()}</td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontFamily: 'monospace', color: '#64748b' }}>
                        {tx.utr_number || '---'}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: style.bg, color: style.color, width: 'fit-content' }}>
                          {style.icon} {tx.status}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {tx.status === 'Pending Verification' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(tx.id, 'Success')}
                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #10b981', color: '#10b981', background: 'white', cursor: 'pointer' }}
                                title="Approve Payment"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(tx.id, 'Rejected')}
                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #f43f5e', color: '#f43f5e', background: 'white', cursor: 'pointer' }}
                                title="Reject Payment"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          ) : (
                            <button style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#64748b', background: 'white', cursor: 'pointer' }}>
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CreatePaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchTransactionsData}
      />
    </motion.div>
  );
};

export default Transactions;
