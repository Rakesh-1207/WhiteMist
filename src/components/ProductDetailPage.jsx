import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Zap, ShieldCheck, MapPin, CheckCircle2, Truck, Heart, ThumbsUp, MessageSquare, Sparkles } from 'lucide-react';
import { PRODUCTS, REVIEWS } from '../data/products';

export default function ProductDetailPage({ product, selectedFormat, onBack, onAddToCart, onBuyNow, wishlistItems, onToggleWishlist }) {
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
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const currentFmt = product.formats[activeFormatIdx];
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  // Gallery images array
  const galleryImages = [
    currentFmt.image,
    product.formats[1]?.image || currentFmt.image,
    product.formats[2]?.image || currentFmt.image
  ];

  const handlePincodeCheck = () => {
    if (pincode.trim().length >= 6) {
      setPincodeStatus({ success: true, text: "Delivering to " + pincode + " in 2 Business Days — FREE Shipping" });
    } else {
      setPincodeStatus({ success: false, text: "Please enter a valid 6-digit Pincode" });
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', background: '#FAFCFF', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Navigation Breadcrumb & Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'white',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '700',
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ArrowLeft size={16} /> Back to Products
          </button>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Home / <span style={{ color: 'var(--color-purple-primary)', fontWeight: '600' }}>{product.categoryName}</span> / <strong>{product.name}</strong>
          </div>
        </div>

        {/* Top Product Information Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '3rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '3rem'
        }} className="pdp-full-grid">

          {/* Left: Gallery & Main Image View */}
          <div>
            <div style={{
              background: product.bgGradient,
              borderRadius: 'var(--radius-md)',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '1.25rem',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}>
              <img 
                src={galleryImages[activeImgIdx] || currentFmt.image} 
                alt={product.name}
                style={{
                  maxHeight: '350px',
                  maxWidth: '85%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
                  transition: 'all 0.3s ease'
                }}
              />

              <span className="badge-primary" style={{ position: 'absolute', top: '15px', left: '15px', background: product.accentColor }}>
                {product.badge}
              </span>

              {/* Wishlist Heart Toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWishlisted ? '#F01262' : '#94A3B8',
                  boxShadow: 'var(--shadow-md)'
                }}
                title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart size={20} fill={isWishlisted ? "#F01262" : "none"} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
              {product.formats.map((fmt, idx) => (
                <div 
                  key={fmt.id}
                  onClick={() => {
                    setActiveFormatIdx(idx);
                    setActiveImgIdx(idx);
                  }}
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: 'var(--radius-sm)',
                    border: activeFormatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    transition: 'var(--transition)'
                  }}
                >
                  <img src={fmt.image} alt={fmt.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', color: '#FFB800' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FFB800" stroke="none" />
                ))}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{product.rating}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>({product.reviewsCount} customer reviews)</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {product.tagline}
            </p>

            {/* Price & Discount */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                ₹{currentFmt.price * quantity}
              </span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{currentFmt.mrp * quantity}
              </span>
              <span className="badge-discount" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>{currentFmt.discount}</span>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginLeft: 'auto' }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Format Picker */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
                Select Format & Pack Size:
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.formats.map((fmt, idx) => (
                  <button
                    key={fmt.id}
                    onClick={() => setActiveFormatIdx(idx)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: activeFormatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #CBD5E1',
                      background: activeFormatIdx === idx ? '#F8FAFC' : 'white',
                      color: activeFormatIdx === idx ? 'var(--text-main)' : '#64748B',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {fmt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', alignItems: 'center' }}>
              {/* Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.75rem',
                background: '#F8FAFC'
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', padding: '0 0.8rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer' }}
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
                style={{ flex: 1, padding: '0.9rem 1.75rem', fontSize: '1rem' }}
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now */}
              <button 
                onClick={() => {
                  onBuyNow(product, currentFmt, quantity);
                }}
                className="btn-accent-blue"
                style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pincode Checker Box */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Truck size={18} style={{ color: 'var(--color-purple-primary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Check Express Delivery Timeline:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ border: '1px solid #CBD5E1', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
                />
                <button 
                  onClick={handlePincodeCheck}
                  style={{ background: 'var(--color-purple-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <div style={{ fontSize: '0.825rem', marginTop: '0.5rem', fontWeight: '600', color: pincodeStatus.success ? '#166534' : '#DC2626' }}>
                  {pincodeStatus.text}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Detailed Features & Specific Product Reviews Section */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          
          {/* Tabs Navigation Header */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '2rem' }}>
            {[
              { id: 'details', label: 'Details & Features' },
              { id: 'ingredients', label: 'Ingredients & Safety' },
              { id: 'usage', label: 'How to Use' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-purple-primary)' : '3px solid transparent',
                  padding: '0.75rem 0.5rem',
                  fontWeight: activeTab === tab.id ? '800' : '600',
                  color: activeTab === tab.id ? 'var(--color-purple-dark)' : '#64748B',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {product.description}
              </p>
              
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '1rem' }}>
                Key Product Advantages:
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {product.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FAFCFF', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                    <CheckCircle2 size={18} style={{ color: '#16A34A' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Fragrance Notes */}
              {product.fragranceNotes && (
                <div style={{ marginTop: '2rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.5rem' }}>
                    🌸 Perfume Fragrance Notes:
                  </h4>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {product.fragranceNotes.map((note, idx) => (
                      <span key={idx}>• {note}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                <strong>Full Ingredients Listing:</strong> {product.ingredients}
              </p>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} />
                <span>100% Dermatologically Tested, Phosphate-free, Bleach-free, and septic tank safe.</span>
              </div>
            </div>
          )}

          {/* Tab 3: How to Use */}
          {activeTab === 'usage' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem', fontSize: '1rem' }}>Standard Load (5-6 kg)</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.howToUse.regular}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem', fontSize: '1rem' }}>Heavy Stains / Large Load</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.howToUse.heavy}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem', fontSize: '1rem' }}>Hand Bucket Wash</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.howToUse.handwash}</div>
              </div>
            </div>
          )}

          {/* Tab 4: Specific Customer Reviews */}
          {activeTab === 'reviews' && (
            <div>
              {/* Rating Summary */}
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '2.5rem', background: '#FAFCFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-purple-dark)', lineHeight: 1 }}>{product.rating}</div>
                  <div style={{ display: 'flex', color: '#FFB800', margin: '0.4rem 0' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFB800" stroke="none" />)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Overall Customer Score</div>
                </div>

                <div style={{ flex: 1, maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[
                    { stars: 5, pct: 92 },
                    { stars: 4, pct: 6 },
                    { stars: 3, pct: 2 },
                    { stars: 2, pct: 0 },
                    { stars: 1, pct: 0 }
                  ].map(item => (
                    <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: '45px' }}>{item.stars} Stars</span>
                      <div style={{ flex: 1, background: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, background: '#FFB800', height: '100%' }} />
                      </div>
                      <span style={{ width: '35px', textAlign: 'right' }}>{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {REVIEWS.map(rev => (
                  <div key={rev.id} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>{rev.name} ({rev.city})</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</div>
                    </div>
                    <div style={{ display: 'flex', color: '#FFB800', marginBottom: '0.5rem' }}>
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="#FFB800" stroke="none" />)}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.55, fontStyle: 'italic' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
