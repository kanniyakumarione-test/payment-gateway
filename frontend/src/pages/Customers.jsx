import React from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calendar, UserPlus, MoreVertical } from 'lucide-react';

const Customers = () => {
  const customers = [
    { name: 'John Doe', email: 'john@example.com', joined: 'Oct 12, 2023', totalSpent: '₹12,400', transactions: 8 },
    { name: 'Sarah Smith', email: 'sarah.s@gmail.com', joined: 'Oct 05, 2023', totalSpent: '₹45,000', transactions: 12 },
    { name: 'Michael Ross', email: 'm.ross@pearson.com', joined: 'Sep 28, 2023', totalSpent: '₹8,900', transactions: 5 },
    { name: 'Emma Wilson', email: 'emma@wilson.co', joined: 'Sep 15, 2023', totalSpent: '₹122,000', transactions: 24 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Customers</h1>
        <button style={{ 
          background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', 
          borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search by name or email..." style={{ background: 'none', border: 'none', outline: 'none', width: '100%' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {customers.map((customer, i) => (
          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', position: 'relative' }}>
            <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <MoreVertical size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                {customer.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{customer.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <Mail size={14} /> {customer.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Total Spent</div>
                <div style={{ fontWeight: 700 }}>{customer.totalSpent}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Transactions</div>
                <div style={{ fontWeight: 700 }}>{customer.transactions}</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
              <Calendar size={14} /> Joined {customer.joined}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Customers;
