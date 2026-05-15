import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Mail, IndianRupee, FileText, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { createTransaction } from '../lib/api';
import { useToast } from '../context/ToastContext';

const CreatePaymentModal = ({ isOpen, onClose, onRefresh }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    customer_email: '',
    method: 'UPI',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      const link = `${window.location.origin}/pay?id=${response.id}&amount=${formData.amount}&merchant=KKPay&vpa=merchant@okaxis`;
      setGeneratedLink(link);
      setShowLink(true);
      showToast('Payment Link Generated!');
      onRefresh();
    } catch (error) {
      showToast('Error creating payment: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '450px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            {!showLink ? (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Create Payment Link</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount (INR)</label>
                    <div style={{ position: 'relative' }}>
                      <IndianRupee size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Customer Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="email" 
                        required
                        placeholder="customer@example.com"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: '#94a3b8' }} />
                      <textarea 
                        rows="3"
                        placeholder="What is this payment for?"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }} 
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Generate Link'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Check size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Link Ready!</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Share this link with your customer to collect ₹{formData.amount}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <input 
                    readOnly 
                    value={generatedLink}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.875rem', color: '#64748b' }}
                  />
                  <button onClick={copyLink} style={{ padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: '#1e293b', color: 'white', cursor: 'pointer' }}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a href={generatedLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '1rem', color: '#1e293b', textDecoration: 'none', fontWeight: 600 }}>
                    <ExternalLink size={18} /> Preview Link
                  </a>
                  <button onClick={() => { setShowLink(false); onClose(); }} style={{ padding: '1rem', background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePaymentModal;
