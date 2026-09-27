import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { SUPER_SAVER_BUNDLE } from '../data/products';

export default function SuperSaverBanner({ onAddBundleToCart }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ padding: '2.5rem 0', background: '#FAFCFF' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        
        <div style={{
          background: 'linear-gradient(135deg, #FFFDE6 0%, #FFF5F8 50%, #E6F3FF 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          border: '1.5px solid #FFB800',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Top Ribbons */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '-38px',
            background: '#DC2626',
            color: 'white',
            fontWeight: '800',
            fontSize: '0.75rem',
            padding: '5px 38px',
            transform: 'rotate(45deg)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            SUPER SAVER
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: '1.75rem',
            alignItems: 'center'
          }} className="saver-grid">

            {/* Left Content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge-primary" style={{ background: '#DC2626', fontSize: '0.7rem' }}>LIMITED TIME DEAL</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={14} /> Save ₹350 (39% OFF)
                </span>
              </div>

              <h2 style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.35rem', lineHeight: 1.2 }}>
                {SUPER_SAVER_BUNDLE.title}
              </h2>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                {SUPER_SAVER_BUNDLE.subtitle}
              </p>

              {/* Countdown Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={16} style={{ color: '#DC2626' }} /> Offer Ends In:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ background: '#1E1B4B', color: 'white', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: '800', fontSize: '0.95rem' }}>
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </div>
                  <div style={{ background: '#1E1B4B', color: 'white', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: '800', fontSize: '0.95rem' }}>
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </div>
                  <div style={{ background: '#1E1B4B', color: 'white', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: '800', fontSize: '0.95rem' }}>
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                      ₹{SUPER_SAVER_BUNDLE.price}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                      ₹{SUPER_SAVER_BUNDLE.mrp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700' }}>
                    Includes FREE Measuring Cap + Delivery
                  </div>
                </div>

                <button
                  onClick={(e) => onAddBundleToCart(SUPER_SAVER_BUNDLE, e)}
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #0084FF 0%, #00C6FF 100%)',
                    boxShadow: '0 6px 16px rgba(0, 132, 255, 0.3)'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Grab Super Saver Bundle</span>
                </button>
              </div>

            </div>

            {/* Right Image Composite */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <img 
                src={SUPER_SAVER_BUNDLE.image} 
                alt="Super Saver Pack Pair"
                style={{
                  maxHeight: '210px',
                  width: 'auto',
                  filter: 'drop-shadow(0 12px 20px rgba(39, 13, 91, 0.18))'
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
