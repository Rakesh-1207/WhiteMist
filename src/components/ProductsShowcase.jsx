import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductsShowcase({ onAddToCart, onOpenModal, searchQuery, onNavigateToAllProducts }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedFormatMap, setSelectedFormatMap] = useState({
    'wm-blue-ocean': 0,
    'wm-pink-floral': 0,
    'wm-yellow-citrus': 0
  });

  const handleFormatSelect = (productId, formatIdx) => {
    setSelectedFormatMap(prev => ({ ...prev, [productId]: formatIdx }));
  };

  // Get flagship featured products for Home Showcase (3 on desktop, 4 on mobile)
  const featuredFour = PRODUCTS.filter(p => ['wm-blue-ocean', 'wm-pink-floral', 'wm-yellow-citrus', 'wm-pouch-yellow-eco'].includes(p.id));

  const filteredProducts = featuredFour.filter(prod => {
    if (activeFilter === 'blue' && prod.color !== 'blue') return false;
    if (activeFilter === 'pink' && prod.color !== 'pink') return false;
    if (activeFilter === 'yellow' && prod.color !== 'yellow') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return prod.name.toLowerCase().includes(q) || 
             prod.description.toLowerCase().includes(q) ||
             prod.tagline.toLowerCase().includes(q);
    }
    return true;
  }).slice(0, 4);

  return (
    <section id="products" style={{ padding: '5rem 0', background: '#FAFCFF' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ color: 'var(--color-blue-ocean)', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              FEATURED FRAGRANCE RANGE
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.25rem', color: 'var(--color-purple-dark)' }}>
              Choose Your Freshness Variant
            </h2>
          </div>

          {/* Filter Tabs (Single Row on Mobile) */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="showcase-filter-tabs">
            {[
              { id: 'all', full: 'All 4 Variants', short: 'All' },
              { id: 'blue', full: 'Ocean Fresh (Blue)', short: 'Blue' },
              { id: 'pink', full: 'Floral Bloom (Pink)', short: 'Pink' },
              { id: 'yellow', full: 'Citrus Sunshine (Yellow)', short: 'Yellow' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: activeFilter === tab.id ? 'none' : '1px solid #CBD5E1',
                  background: activeFilter === tab.id ? 'var(--color-purple-primary)' : 'white',
                  color: activeFilter === tab.id ? 'white' : '#475569',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: activeFilter === tab.id ? '0 4px 14px rgba(63, 27, 133, 0.25)' : 'none'
                }}
              >
                <span className="full-tab-label">{tab.full}</span>
                <span className="short-tab-label">{tab.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (3 on Desktop, 4 on Mobile) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem'
        }} className="featured-three-grid">
          {filteredProducts.map((product, idx) => {
            const formatIdx = selectedFormatMap[product.id] || 0;
            const currentFormat = product.formats[formatIdx];

            return (
              <div key={product.id} className={`product-card ${idx === 3 ? 'mobile-only-card' : ''}`} style={{ padding: '1.5rem', flexDirection: 'column' }}>
                
                {/* Top Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                  <span className="badge-primary" style={{ background: product.accentColor }}>
                    {product.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                    Front & Top Load
                  </span>
                </div>

                {/* Product Image Stage (Clicking opens Full Details Page!) */}
                <div 
                  onClick={() => onOpenModal(product, currentFormat)}
                  style={{
                    height: '260px',
                    background: product.bgGradient,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '1.25rem'
                  }}
                >
                  <img 
                    src={currentFormat.image} 
                    alt={product.name}
                    className="product-img"
                    style={{
                      maxHeight: '220px',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.12))'
                    }}
                  />
                  
                  {/* Quick View Eye Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--color-purple-primary)'
                  }} title="Full Details">
                    <Eye size={18} />
                  </div>
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#FFB800' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#FFB800" stroke="none" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>{product.rating}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                </div>

                {/* Title & Description */}
                <h3 
                  onClick={() => onOpenModal(product, currentFormat)}
                  style={{ fontSize: '1.35rem', fontWeight: '800', cursor: 'pointer', color: 'var(--text-main)', marginBottom: '0.25rem', lineHeight: 1.2 }}
                >
                  {product.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', flexGrow: 1 }}>
                  {product.tagline}
                </p>

                {/* Format Selector Pills */}
                <div style={{ marginBottom: '1.25rem' }} className="card-format-selector">
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Select Pack / Size:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.formats.map((fmt, idx) => (
                      <button
                        key={fmt.id}
                        onClick={() => handleFormatSelect(product.id, idx)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: formatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #E2E8F0',
                          background: formatIdx === idx ? '#F8FAFC' : 'white',
                          color: formatIdx === idx ? 'var(--text-main)' : '#64748B',
                          fontSize: '0.775rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        {fmt.name.split(' ')[0]} {fmt.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price & Add to Cart Footer Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                        ₹{currentFormat.price}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                        ₹{currentFormat.mrp}
                      </span>
                    </div>
                    <span className="badge-discount">{currentFormat.discount}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => onAddToCart(product, currentFormat, e)}
                    className="btn-primary card-add-btn"
                    style={{
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span className="btn-text">Add to Cart</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA to View Full Catalogue */}
        {onNavigateToAllProducts && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={onNavigateToAllProducts}
              className="btn-secondary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
            >
              <span>Explore All Products & Eco Refills</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
