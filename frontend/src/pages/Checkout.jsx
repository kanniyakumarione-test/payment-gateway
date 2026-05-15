import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Smartphone, CheckCircle2, Copy, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import axios from 'axios';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [utr, setUtr] = useState('');
  
  const transactionId = searchParams.get('id');
  const amount = searchParams.get('amount') || '0.00';
  const merchantName = searchParams.get('merchant') || 'KKPay Merchant';
  const vpa = searchParams.get('vpa') || 'merchant@okaxis';
  
  const upiLink = `upi://pay?pa=${vpa}&pn=${merchantName}&am=${amount}&cu=INR&tn=Payment to ${merchantName}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (utr.length < 12) {
      alert('Please enter a valid 12-digit UTR number');
      return;
    }
    
    setLoading(true);
    try {
      // Direct axios call because this is a public route (no firebase token)
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/payments/verify`, {
        transactionId,
        utrNumber: utr
      });
      setSuccess(true);
    } catch (err) {
      alert('Error verifying payment: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'white', padding: '3rem', borderRadius: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}
        >
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Payment Submitted!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your payment for ₹{amount} has been received. Our team will verify the UTR number shortly.
          </p>
          <button 
            onClick={() => window.close()}
            style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Close Window
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Logo size={40} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '450px', width: '100%' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Amount to Pay</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1e293b' }}>₹{amount}</div>
          </div>

          <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <QRCodeSVG value={upiLink} size={180} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', fontWeight: 600 }}>Scan QR with GPay, PhonePe or Paytm</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href={upiLink}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: '#1e293b', color: 'white', borderRadius: '1rem', textDecoration: 'none', fontWeight: 700 }}
            >
              <Smartphone size={20} /> Pay via App
            </a>
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--primary)" /> Confirm Payment
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
            After paying, please enter the **12-digit UTR / Ref No.** from your payment app to confirm.
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter 12-digit UTR Number"
              maxLength={12}
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
              style={{ padding: '1rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', fontWeight: 600, textAlign: 'center', letterSpacing: '0.2em' }}
            />
            <button 
              disabled={loading}
              style={{ padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify Payment'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: '0.75rem' }}>
            <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
              Do not close this page or refresh until you enter the UTR number.
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>
        Secured by KKPay Infrastructure
      </div>
    </div>
  );
};

export default Checkout;
