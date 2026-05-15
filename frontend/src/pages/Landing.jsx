import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { CreditCard, RefreshCw, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Landing() {
  const features = [
    { icon: <CreditCard />, title: 'Global Checkout', desc: 'Optimized for high conversion with saved cards and international currencies support.', color: 'var(--primary)' },
    { icon: <RefreshCw />, title: 'Subscriptions', desc: 'Automate recurring billing with flexible cycles and automated retry logic.', color: 'var(--secondary)' },
    { icon: <FileText />, title: 'Smart Invoicing', desc: 'GST-compliant invoices sent automatically via email and SMS to your customers.', color: 'var(--accent)' },
    { icon: <ShieldCheck />, title: 'Advanced Fraud Engine', desc: 'Minimize chargebacks with our AI-driven risk scoring and fraud prevention system.', color: 'var(--danger)' },
  ];

  return (
    <div className="landing">
      <Navbar />
      <Hero />

      {/* Partners Section */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <p style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>
            Trusted by 50,000+ businesses globally
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5, filter: 'grayscale(100%)' }}>
            {['LOGO 1', 'LOGO 2', 'LOGO 3', 'LOGO 4', 'LOGO 5'].map(logo => (
              <div key={logo} style={{ fontWeight: 800, fontSize: '1.25rem', color: '#cbd5e1' }}>{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="payments" style={{ padding: '8rem 0', background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              The most powerful <span className="gradient-text">payment gateway</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
              Accept 100+ payment methods including Cards, UPI, Netbanking, and Wallets with a single integration.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
            {features.map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: feature.color, marginBottom: '1.5rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-dark)', padding: '5rem', borderRadius: '40px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to transform your <span className="gradient-text">financial stack</span>?</h2>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Join thousands of developers and entrepreneurs building the future of commerce.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link to="/dashboard" style={{ 
                padding: '1rem 2rem', fontSize: '1.125rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' 
              }}>
                Create Free Account
              </Link>
              <button style={{ 
                padding: '1rem 2rem', fontSize: '1.125rem', background: 'transparent', 
                color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer' 
              }}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f8fafc', padding: '6rem 0 2rem', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '8px' }} />
                <span>AuraPay</span>
              </div>
              <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', maxWidth: '250px' }}>Modern financial infrastructure for global businesses.</p>
            </div>
            {['Products', 'Developers', 'Company'].map(col => (
              <div key={col}>
                <h4 style={{ marginBottom: '1.5rem' }}>{col}</h4>
                <ul style={{ listStyle: 'none' }}>
                  {['Link 1', 'Link 2', 'Link 3'].map(link => (
                    <li key={link} style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <p>© 2026 AuraPay Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
