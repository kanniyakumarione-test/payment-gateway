import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

const Pricing = () => {
  const plans = [
    {
      name: 'Independent',
      price: '₹0',
      desc: 'Perfect for startups and independent merchants.',
      features: [
        'Direct UPI Settlement',
        'Zero Transaction Fees',
        'Unlimited Payments',
        'Basic Analytics',
        'Community Support'
      ],
      button: 'Get Started',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'For high-volume businesses and platforms.',
      features: [
        'Everything in Independent',
        'Dedicated API Access',
        'Custom Settlement Logic',
        'Advanced Fraud Guard',
        'Priority 24/7 Support'
      ],
      button: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', fontFamily: 'Outfit' }}>
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
            No hidden fees, no volume-based commissions. Just pure financial freedom.
          </p>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              style={{ 
                background: 'white', padding: '3rem', borderRadius: '2rem', 
                border: plan.highlight ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                boxShadow: plan.highlight ? '0 20px 40px rgba(99, 102, 241, 0.1)' : 'none',
                position: 'relative'
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>{plan.price}</span>
                {plan.price !== 'Custom' && <span style={{ color: '#64748b', fontWeight: 600 }}>/month</span>}
              </div>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9375rem' }}>{plan.desc}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', fontWeight: 500, color: '#1e293b' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="#10b981" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <button style={{ 
                width: '100%', padding: '1rem', borderRadius: '1rem', border: 'none', 
                background: plan.highlight ? 'var(--primary)' : '#1e293b', 
                color: 'white', fontWeight: 700, cursor: 'pointer' 
              }}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
