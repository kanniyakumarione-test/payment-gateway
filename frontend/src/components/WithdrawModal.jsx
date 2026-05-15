import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Landmark, IndianRupee, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const WithdrawModal = ({ isOpen, onClose, onRefresh, balance = 0 }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    if (val > balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/payouts/request', {
        amount: val,
        bank_name: 'HDFC Bank', // In real app, fetch from settings
        account_number: 'xxxx 4421'
      });
      setSuccess(true);
      onRefresh();
    } catch (err) {
      showToast('Failed to request withdrawal: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '400px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            {!success ? (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Withdraw Funds</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Available Balance: ₹{balance.toLocaleString()}</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount to Withdraw</label>
                    <div style={{ position: 'relative' }}>
                      <IndianRupee size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1.125rem', fontWeight: 700 }} 
                      />
                    </div>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Landmark size={20} color="#64748b" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Settling To</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Registered Bank Account</div>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Withdrawal'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Request Sent!</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  Your withdrawal request for ₹{amount} has been submitted. It will be processed within 24-48 hours.
                </p>
                <button onClick={onClose} style={{ width: '100%', padding: '1rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;
