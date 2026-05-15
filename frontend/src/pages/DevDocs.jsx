import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Copy, Check, ExternalLink, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DevDocs = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    showToast('Code snippet copied!');
    setTimeout(() => setCopied(''), 2000);
  };

  const snippets = {
    curl: `curl -X POST https://payment-gateway-seven-navy.vercel.app/api/payments/create \\
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500,
    "customer_email": "customer@example.com",
    "description": "Premium Subscription"
  }'`,
    node: `const axios = require('axios');

const createPayment = async () => {
  const response = await axios.post('https://payment-gateway-seven-navy.vercel.app/api/payments/create', {
    amount: 500,
    customer_email: 'customer@example.com',
    description: 'Premium Subscription'
  }, {
    headers: { 'Authorization': 'Bearer YOUR_FIREBASE_TOKEN' }
  });
  
  console.log('Payment Link:', \`\${window.location.origin}/pay?id=\${response.data.transaction.id}\`);
};`
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem' }}>Developer Documentation</h1>
        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Integrate KKPay's zero-commission gateway into your own application in minutes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Auth Section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                <ShieldCheck size={20} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Authentication</h2>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              All API requests must be authenticated using your Firebase ID Token. Include it in the header as:
            </p>
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.75rem', color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              Authorization: Bearer YOUR_TOKEN
            </div>
          </section>

          {/* Create Payment Section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', color: '#10b981' }}>
                <Zap size={20} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create Payment Link</h2>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              To programmatically generate a payment link for a customer, send a POST request to the <code>/api/payments/create</code> endpoint.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Request Body</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <code style={{ color: 'var(--primary)', fontWeight: 600 }}>amount</code>
                    <span style={{ color: '#94a3b8' }}>Number (Required)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <code style={{ color: 'var(--primary)', fontWeight: 600 }}>customer_email</code>
                    <span style={{ color: '#94a3b8' }}>String (Required)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Code Sidebar */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ background: '#1e293b', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1rem', background: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Example Request</div>
            </div>
            
            <div style={{ padding: '1.5rem', position: 'relative' }}>
              <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.8125rem', overflowX: 'auto', lineHeight: 1.6 }}>
                <code>{snippets.curl}</code>
              </pre>
              <button 
                onClick={() => copyToClipboard(snippets.curl, 'curl')}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#475569', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', cursor: 'pointer' }}
              >
                {copied === 'curl' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '1rem', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="var(--primary)" /> API Base URL
            </h4>
            <code style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>https://payment-gateway-seven-navy.vercel.app/api</code>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevDocs;
