import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { CreditCard, RefreshCw, FileText, ShieldCheck, Zap, Globe, Lock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function Landing() {
  const features = [
    { icon: <Zap />, title: 'Instant UPI', desc: 'Accept direct-to-bank UPI payments with zero delay and instant confirmation.', color: '#6366f1' },
    { icon: <ShieldCheck />, title: 'Secure Vault', desc: 'Industry-leading encryption and 2FA to keep your merchant funds protected.', color: '#10b981' },
    { icon: <Globe />, title: 'Global Settlement', desc: 'Receive settlements in any currency with our multi-currency backend support.', color: '#f59e0b' },
    { icon: <Cpu />, title: 'Smart Routing', desc: 'AI-driven gateway routing to ensure the highest transaction success rates.', color: '#8b5cf6' },
  ];

  const footerLinks = {
    Products: [
      { name: 'Payments', path: '/dashboard' },
      { name: 'Payouts', path: '/dashboard/payouts' },
      { name: 'Verification', path: '/dashboard/transactions' },
      { name: 'UPI Gateway', path: '/dashboard/docs' }
    ],
    Developers: [
      { name: 'API Docs', path: '/dashboard/docs' },
      { name: 'SDKs', path: '/dashboard/docs' },
      { name: 'Status', path: '/legal' },
      { name: 'Integration', path: '/dashboard/docs' }
    ],
    Company: [
      { name: 'About Us', path: '/' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Security', path: '/legal' },
      { name: 'Privacy Policy', path: '/legal' }
    ]
  };

  return (
    <div className="landing">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" style={{ padding: '8rem 0', background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'Outfit' }}>
              Built for <span className="gradient-text">Modern Commerce</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
              The most robust financial infrastructure in India. Zero commissions, absolute freedom.
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
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ background: '#1e293b', padding: '5rem', borderRadius: '40px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2 }} />
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Ready to Scale?</h2>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Join the elite circle of merchants processing billions with KKPay.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" style={{ 
                padding: '1.25rem 2.5rem', fontSize: '1.125rem', background: 'var(--primary)', 
                color: 'white', border: 'none', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' 
              }}>
                Get Started Now
              </Link>
              <a href="mailto:kanniyakumarione@gmail.com" style={{ 
                padding: '1.25rem 2.5rem', fontSize: '1.125rem', background: 'transparent', 
                color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none'
              }}>
                Talk to Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f8fafc', padding: '6rem 0 2rem', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <Logo size={32} />
              <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', maxWidth: '250px', lineHeight: 1.6 }}>
                Modern financial infrastructure for global businesses. Secured by KK One Group.
              </p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 style={{ marginBottom: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{title}</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {links.map(link => (
                    <li key={link.name} style={{ marginBottom: '0.875rem' }}>
                      <Link to={link.path} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>
            <p>© 2026 KKPay Infrastructure. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
              <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>Legal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
