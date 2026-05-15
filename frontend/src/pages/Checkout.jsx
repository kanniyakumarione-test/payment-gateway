import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Smartphone, CheckCircle2, Copy, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [utr, setUtr] = useState('');
  
  const [merchantData, setMerchantData] = useState({
    vpa: 'kanniyakumarione@okaxis',
    name: 'KKPay Merchant'
  });

  const transactionId = searchParams.get('id');
  const amount = searchParams.get('amount') || '0.00';
  
  const upiLink = `upi://pay?pa=${merchantData.vpa}&pn=${encodeURIComponent(merchantData.name)}&am=${amount}&cu=INR&mc=0000&mode=02`;

  // 1. REAL-TIME LISTENER: Watch for Admin Approval
  useEffect(() => {
    if (!transactionId) return;

    // Listen for changes to this specific transaction in the DB
    const txSubscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'transactions', 
        filter: `id=eq.${transactionId}` 
      }, (payload) => {
        if (payload.new.status === 'Success' || payload.new.status === 'Completed') {
          setSuccess(true);
        }
      })
      .subscribe();

    const fetchDetails = async () => {
      try {
        const { data: tx } = await supabase.from('transactions').select('status, merchant_id').eq('id', transactionId).single();
        if (tx.status === 'Success' || tx.status === 'Completed') setSuccess(true);
        
        const { data: merch } = await supabase.from('merchants').select('upi_id, business_name').eq('id', tx.merchant_id).single();
        if (merch) setMerchantData({ vpa: merch.upi_id, name: merch.business_name });
      } catch (err) {} finally { setFetching(false); }
    };

    fetchDetails();

    return () => {
      supabase.removeChannel(txSubscription);
    };
  }, [transactionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (utr.length < 12) {
      alert('Please enter a valid 12-digit UTR number');
      return;
    }
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://payment-gateway-server-rho.vercel.app/api';
      await axios.post(`${API_URL}/payments/verify`, {
        transactionId,
        utrNumber: utr
      });
      // We don't setSuccess(true) here immediately, we wait for the listener or show a "Verification Pending" state
      showToast('UTR Submitted for verification!');
    } catch (err) {
      alert('Error verifying payment: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '3rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}><CheckCircle2 size={40} color="#10b981" /></div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Payment Successful!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>Your payment of ₹{amount} has been verified and completed successfully.</p>
          <button onClick={() => window.close()} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer' }}>Close Window</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '2rem' }}><Logo size={40} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '450px', width: '100%' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Amount to Pay</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1e293b' }}>₹{amount}</div>
            <div style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: 700, marginTop: '0.25rem' }}>{merchantData.name}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.25rem', marginBottom: '2rem', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', display: 'inline-block', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}><QRCodeSVG value={upiLink} size={200} includeMargin={true} level="H" /></div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '1.25rem', fontWeight: 700 }}>Scan QR with GPay, PhonePe or Paytm</p>
          </div>

          <button onClick={() => { const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); if (isMobile) window.location.href = upiLink; else alert('Please scan the QR code with your phone.'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer' }}><Smartphone size={20} /> Pay via App</button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={20} color="#10b981" /> Confirm Payment</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>After paying, please enter the **12-digit UTR** from your app. The page will update automatically once verified.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input type="text" placeholder="Enter 12-digit UTR" maxLength={12} value={utr} onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.2em', color: 'var(--primary)' }} />
            <button disabled={loading} style={{ width: '100%', padding: '1rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>{loading ? <Loader2 className="animate-spin" /> : 'Verify Payment'}</button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.75rem', border: '1px solid #e0f2fe', display: 'flex', gap: '0.75rem' }}>
            <div className="animate-pulse" style={{ width: '8px', height: '8px', background: '#0ea5e9', borderRadius: '50%', marginTop: '4px' }} />
            <p style={{ fontSize: '0.75rem', color: '#0369a1', lineHeight: 1.5 }}>Listening for payment confirmation. Page will auto-update.</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> Secured by KKPay Infrastructure</div>
    </div>
  );
};

export default Checkout;
