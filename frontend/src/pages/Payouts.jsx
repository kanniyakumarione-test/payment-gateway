import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, History, Download, Clock, CheckCircle2 } from 'lucide-react';

const Payouts = () => {
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Available for Payout', value: '₹124,500.00', icon: <Wallet color="var(--primary)" /> },
    { label: 'Last Payout', value: '₹45,000.00', icon: <CheckCircle2 color="var(--accent)" /> },
    { label: 'Pending Payouts', value: '₹12,000.00', icon: <Clock color="#f59e0b" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Payouts</h1>
        <button style={{ 
          background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', 
          borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <ArrowUpRight size={18} /> Withdraw Funds
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
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
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Payout History</h3>
          <button style={{ background: 'none', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Download
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Payout ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Bank Account</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Amount</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>#PAY-00{i}1</td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>HDFC Bank - 4421</td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>₹15,000.00</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
                    Processed
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>Oct {20+i}, 2023</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Payouts;
