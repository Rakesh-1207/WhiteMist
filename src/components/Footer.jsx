import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer style={{ background: '#1E1B4B', color: 'white', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        
        {/* Top Newsletter Card */}
        <div style={{
          background: 'linear-gradient(135deg, #3F1B85 0%, #270D5B 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          marginBottom: '4rem',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '2rem',
          alignItems: 'center'
        }} className="footer-newsletter-grid">
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFB800', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} /> UNLOCK 10% EXTRA SAVINGS
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
              Subscribe to Laundry Care Tips & Exclusive Discounts
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.925rem' }}>
              Get secret promotional codes, stain removal guides, and early access to new White Mist fragrances!
            </p>
          </div>

          <div>
            {subscribed ? (
              <div style={{ background: 'rgba(22, 163, 74, 0.2)', border: '1px solid #16A34A', padding: '1rem', borderRadius: 'var(--radius-sm)', color: '#BBF7D0', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> Success! Use code <strong>MISTWELCOME10</strong> for 10% Off!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
                <button 
                  type="submit"
                  className="btn-accent-blue" 
                  style={{ padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}
                >
                  Join Club
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Links Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '2.5rem',
          marginBottom: '3rem'
        }} className="footer-links-grid">
          
          <div>
            <img src="/assets/images/logo.png" alt="Meridian White Mist" style={{ height: '38px', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Meridian White Mist is a registered trademark of Meridian Hygiene & Home Care Pvt. Ltd. Engineered for superior bio-stain removal & long-lasting fragrance.
            </p>
            <div style={{ fontSize: '0.825rem', color: '#CBD5E1' }}>
              📞 Customer Care: 1800-425-MIST (6478) <br />
              ✉️ Support: care@meridianwhitemist.com
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Products</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li>Ocean Fresh Liquid (Blue)</li>
              <li>Floral Bloom Liquid (Pink)</li>
              <li>Citrus Sunshine (Yellow)</li>
              <li>2kg Eco Spout Refill Pouches</li>
              <li>Super Saver Combo Packs</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Machine Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li>Front Load Washing Tips</li>
              <li>Top Load Washing Tips</li>
              <li>Dosage Calculator</li>
              <li>Stain Removal Guide</li>
              <li>Fabric Softener Usage</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Trust & Assurance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: '#0084FF' }} /> 100% Quality Guaranteed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: '#0084FF' }} /> Machine Manufacturer Approved
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: '#0084FF' }} /> Dermatologically Tested
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment icons */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Meridian White Mist Liquid Detergent. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: '#CBD5E1', fontWeight: '600' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Shipping Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
