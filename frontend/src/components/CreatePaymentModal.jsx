import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Mail, IndianRupee, FileText, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { createTransaction } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';

const CreatePaymentModal = ({ isOpen, onClose, onRefresh }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [merchantVpa, setMerchantVpa] = useState('kanniyakumarione@okaxis');
  const [businessName, setBusinessName] = useState('KKPay Merchant');
  
  const [formData, setFormData] = useState({
    amount: '',
    customer_email: '',
    description: ''
  });

  // Fetch Merchant VPA from settings
  useEffect(() => {
    const fetchMerchantDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const { data } = await supabase
        .from('merchants')
        .select('upi_id, business_name')
        .eq('id', user.uid)
        .single();
        
      if (data) {
        if (data.upi_id) setMerchantVpa(data.upi_id);
        if (data.business_name) setBusinessName(data.business_name);
      }
    };
    
    if (isOpen) fetchMerchantDetails();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createTransaction({
        amount: parseFloat(formData.amount),
        customer_email: formData.customer_email,
        description: formData.description
      });
      
      // Generate real dynamic link
      const link = `${window.location.origin}/pay?id=${response.id}&amount=${formData.amount}&merchant=${encodeURIComponent(businessName)}&vpa=${merchantVpa}`;
      setGeneratedLink(link);
      setShowLink(true);
      showToast('Payment Link Generated!');
      onRefresh();
    } catch (error) {
      showToast('Error creating payment: ' + (error.response?.data?.message || error.message), 'error');
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
                        step="0.01"
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
                    <textarea 
                      placeholder="What is this payment for?"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', minHeight: '80px', resize: 'none' }} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate Link'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Link Ready!</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Share this link with your customer to receive payment.</p>
                
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', wordBreak: 'break-all', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {generatedLink}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={copyLink} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                    {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                  <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#1e293b', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
                    <ExternalLink size={18} /> Test Link
                  </a>
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
