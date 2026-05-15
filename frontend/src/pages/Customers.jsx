import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar, UserPlus, MoreVertical, Loader2 } from 'lucide-react';
import api from '../lib/api';
import LoadingScreen from '../components/LoadingScreen';

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers/list');
        setCustomers(response.data.customers);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Customers</h1>
      </div>

      <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search by email..." style={{ background: 'none', border: 'none', outline: 'none', width: '100%' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem' }}>
          <LoadingScreen />
        </div>
      ) : customers.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <p>No customers found yet. They will appear here once you receive payments.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {customers.map((customer, i) => (
            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                  {customer.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{customer.email.split('@')[0]}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Mail size={14} /> {customer.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Total Spent</div>
                  <div style={{ fontWeight: 700 }}>₹{customer.totalSpent.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Trx Count</div>
                  <div style={{ fontWeight: 700 }}>{customer.transactions}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <Calendar size={14} /> First Paid {new Date(customer.joined).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Customers;
