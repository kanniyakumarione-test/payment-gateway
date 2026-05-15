import React from 'react';
import Navbar from '../components/Navbar';
import { Shield, Lock, FileText } from 'lucide-react';

const Legal = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Outfit' }}>Legal & Compliance</h1>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Trust and security are our top priorities.</p>
          </div>

          <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <Shield size={24} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Privacy Policy</h2>
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>
                At KKPay, we value your privacy. We collect only necessary data to facilitate payments and ensure security. Your merchant data is never sold to third parties.
              </p>
              <p style={{ color: '#64748b', lineHeight: 1.7 }}>
                All transaction data is encrypted and stored in our secure infrastructure managed by KK One Group.
              </p>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <FileText size={24} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Terms of Service</h2>
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>
                By using KKPay, you agree to comply with Indian financial regulations. Our platform is a "Direct-to-Bank" UPI gateway.
              </p>
              <ul style={{ color: '#64748b', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
                <li>No prohibited or illegal business activities.</li>
                <li>Merchants are responsible for verifying their own bank settlements.</li>
                <li>Zero-commission policy is subject to fair usage.</li>
              </ul>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <Lock size={24} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Security Standards</h2>
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.7 }}>
                We use 256-bit SSL encryption and follow RBI guidelines for UPI-based payment processing. Our verification system ensures that UTR numbers are validated before status updates.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
