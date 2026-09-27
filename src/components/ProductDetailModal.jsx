import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, MapPin, CheckCircle2, ChevronRight, Truck, Heart } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductDetailModal({ product, selectedFormat, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  const [activeFormatIdx, setActiveFormatIdx] = useState(
    product.formats.findIndex(f => f.id === selectedFormat?.id) >= 0 
      ? product.formats.findIndex(f => f.id === selectedFormat?.id) 
      : 0
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const currentFmt = product.formats[activeFormatIdx];

  const handlePincodeCheck = () => {
    if (pincode.trim().length >= 6) {
      setPincodeStatus({ success: true, text: "Standard Delivery in 2 Business Days — FREE Shipping" });
    } else {
      setPincodeStatus({ success: false, text: "Please enter a valid 6-digit Pincode" });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      
      {/* Modal Container */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        padding: '2rem'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            transition: 'var(--transition)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '2.5rem'
        }} className="pdp-grid">

          {/* Left Column: Product Gallery View */}
          <div>
            <div style={{
              background: product.bgGradient,
              borderRadius: 'var(--radius-md)',
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '1rem',
              border: '1px solid #E2E8F0'
            }}>
              <img 
                src={currentFmt.image} 
                alt={product.name}
                style={{
                  maxHeight: '300px',
                  maxWidth: '85%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))'
                }}
              />
              <span className="badge-primary" style={{ position: 'absolute', top: '15px', left: '15px', background: product.accentColor }}>
                {product.badge}
              </span>
            </div>

            {/* Micro Thumbnail Selector */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {product.formats.map((fmt, idx) => (
                <div 
                  key={fmt.id}
                  onClick={() => setActiveFormatIdx(idx)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    border: activeFormatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <img src={fmt.image} alt={fmt.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', color: '#FFB800' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#FFB800" stroke="none" />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({product.reviewsCount} customer reviews)</span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.25rem' }}>
              {product.name}
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {product.tagline}
            </p>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                ₹{currentFmt.price * quantity}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{currentFmt.mrp * quantity}
              </span>
              <span className="badge-discount" style={{ fontSize: '0.85rem' }}>{currentFmt.discount}</span>
            </div>

            {/* Format Selection Buttons */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Select Packaging & Size:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.formats.map((fmt, idx) => (
                  <button
                    key={fmt.id}
                    onClick={() => setActiveFormatIdx(idx)}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: activeFormatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #CBD5E1',
                      background: activeFormatIdx === idx ? '#F8FAFC' : 'white',
                      color: activeFormatIdx === idx ? 'var(--text-main)' : '#64748B',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {fmt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              {/* Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.6rem',
                background: '#F8FAFC'
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ fontWeight: '800', fontSize: '1rem', padding: '0 0.6rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={(e) => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product, currentFmt, e);
                  }
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now Instant Checkout */}
              <button 
                onClick={() => {
                  onBuyNow(product, currentFmt, quantity);
                }}
                className="btn-accent-blue"
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pincode Delivery Checker */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              border: '1px solid #E2E8F0',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Truck size={16} style={{ color: 'var(--color-purple-primary)' }} />
                <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>Check Delivery Timeline:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', flex: 1 }}
                />
                <button 
                  onClick={handlePincodeCheck}
                  style={{ background: 'var(--color-purple-primary)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: '600', color: pincodeStatus.success ? '#166534' : '#DC2626' }}>
                  {pincodeStatus.text}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Tabbed Details */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
            {[
              { id: 'details', label: 'Details & Benefits' },
              { id: 'ingredients', label: 'Ingredients & Safety' },
              { id: 'usage', label: 'How to Use' },
              { id: 'reviews', label: 'Customer Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-purple-primary)' : '3px solid transparent',
                  padding: '0.5rem 1rem',
                  fontWeight: activeTab === tab.id ? '700' : '600',
                  color: activeTab === tab.id ? 'var(--color-purple-dark)' : '#64748B',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {product.description}
              </p>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {product.features.map((f, i) => (
                  <li key={i} style={{ fontWeight: '600' }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                <strong>Ingredients Breakdown:</strong> {product.ingredients}
              </p>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
                ✅ Phosphate-free, Bleach-free, and safe for delicate skin.
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-purple-dark)', marginBottom: '0.3rem' }}>Standard Load</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.howToUse.regular}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-purple-dark)', marginBottom: '0.3rem' }}>Heavy Stains</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.howToUse.heavy}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-purple-dark)', marginBottom: '0.3rem' }}>Hand Wash</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.howToUse.handwash}</div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>{product.rating}</div>
                <div>
                  <div style={{ display: 'flex', color: '#FFB800' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFB800" stroke="none" />)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Based on {product.reviewsCount} verified customer reviews</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
