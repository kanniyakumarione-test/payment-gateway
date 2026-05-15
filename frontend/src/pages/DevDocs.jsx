import React from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Terminal, Zap, Shield, Globe } from 'lucide-react';

const CodeBlock = ({ code, language }) => (
  <div style={{ background: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', position: 'relative', overflow: 'hidden', margin: '1.5rem 0' }}>
    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>
      <Copy size={18} />
    </div>
    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{language}</div>
    <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.875rem', fontFamily: 'monospace', overflowX: 'auto' }}>
      <code>{code}</code>
    </pre>
  </div>
);

const DevDocs = () => {
  const curlCode = `curl -X POST https://api.aurapay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -d amount=1299 \\
  -d currency=INR \\
  -d description="Order #8821"`;

  const nodeCode = `const AuraPay = require('aurapay');
const aura = new AuraPay('YOUR_SECRET_KEY');

const payment = await aura.payments.create({
  amount: 1299,
  currency: 'INR',
  customer: 'cust_9218',
  description: 'Order #8821'
});`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '900px' }}
    >
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem' }}>API Documentation</h1>
        <p style={{ fontSize: '1.125rem', color: '#64748b' }}>Integrate AuraPay into your application with our robust and easy-to-use APIs.</p>
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={24} color="var(--primary)" /> Getting Started
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          To start accepting payments, you'll need your API Secret Key from the settings dashboard. Our API follows RESTful principles and returns JSON-encoded responses.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <Shield size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Secure</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>PCI-DSS Level 1 compliant infrastructure.</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <Globe size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Global</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Supports 100+ countries and 50+ currencies.</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <Terminal size={24} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Developer First</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>SDKs for Node, Python, Ruby, and Go.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Creating a Payment</h2>
        <p style={{ color: '#64748b' }}>Send a POST request to the /payments endpoint to initiate a new transaction.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Using cURL</h3>
          <CodeBlock language="bash" code={curlCode} />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Using Node.js SDK</h3>
          <CodeBlock language="javascript" code={nodeCode} />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Webhooks</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Webhooks allow you to receive real-time notifications when events occur in your account. For example, when a payment is successful or a refund is processed.
        </p>
        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
          Learn more about setting up webhooks in our <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>detailed guide</a>.
        </div>
      </section>
    </motion.div>
  );
};

export default DevDocs;
