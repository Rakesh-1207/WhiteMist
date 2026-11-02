import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { REVIEWS } from '../data/products';

export default function Testimonials() {
  const [reviewsList, setReviewsList] = useState(REVIEWS);

  useEffect(() => {
    api.getReviews()
      .then(dbReviews => {
        if (dbReviews && dbReviews.length > 0) {
          setReviewsList(dbReviews);
        }
      })
      .catch(err => console.warn('Could not load reviews from API, using fallback:', err));
  }, []);
  return (
    <section id="reviews" className="reviews-section" style={{ padding: '5rem 0', background: 'white' }}>
      <div className="container">
        
        {/* Header */}
        <div className="reviews-header" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--color-purple-dark)' }}>
            Loved by Over 50,000+ Homes
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            See why households across India are switching to White Mist for pristine whiteness and unbeatable freshness.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {reviewsList.map((rev) => (
            <div key={rev.id} className="review-card" style={{
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
                <div className="review-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', color: '#FFB800' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFB800" stroke="none" />
                    ))}
                  </div>
                  <span className="review-verified-badge" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> {rev.role || 'Verified Buyer'}
                  </span>
                </div>

                <p className="review-card-comment" style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div className="review-card-footer" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <div className="review-card-author" style={{ fontWeight: '700', color: 'var(--color-purple-dark)', fontSize: '0.95rem' }}>
                  {rev.author || rev.name}
                </div>
                <div className="review-card-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {rev.city} {rev.date ? `• ${rev.date}` : ''}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
