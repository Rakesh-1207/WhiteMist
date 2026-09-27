import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function Testimonials() {
  return (
    <section id="reviews" style={{ padding: '5rem 0', background: 'white' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <span style={{ color: 'var(--color-pink-floral)', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            REAL LAUNDRY EXPERIENCES
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: 'var(--color-purple-dark)' }}>
            Loved by Over 50,000+ Homes
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            See why households across India are switching to White Mist for pristine whiteness and unbeatable freshness.
          </p>
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {REVIEWS.map((rev) => (
            <div key={rev.id} style={{
              background: '#FAFCFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              
              <div>
                {/* Rating & Verified badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', color: '#FFB800' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFB800" stroke="none" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={12} /> Verified Buyer
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-purple-dark)', fontSize: '0.95rem' }}>
                  {rev.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {rev.city} • <span style={{ color: 'var(--color-blue-ocean)' }}>{rev.variant}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
