import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { PROMO_CODES } from '../data/products';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const mrpTotal = cartItems.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);
  const productDiscount = mrpTotal - subtotal;

  // Free shipping threshold ₹499
  const freeShippingThreshold = 499;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || cartItems.length === 0 ? 0 : 49;

  // Promo Code Calculation
  let promoDiscount = 0;
  if (appliedPromo) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo) {
      if (promo.discountPercent) {
        promoDiscount = Math.round((subtotal * promo.discountPercent) / 100);
      } else if (promo.discountAmount) {
        promoDiscount = promo.discountAmount;
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - promoDiscount + shippingCost);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      const p = PROMO_CODES[code];
      if (subtotal < p.minSpend) {
        setPromoError(`Minimum spend of ₹${p.minSpend} required for code ${code}`);
      } else {
        setAppliedPromo(code);
        setPromoError('');
      }
    } else {
      setPromoError('Invalid Coupon Code. Try: MISTFRESH');
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
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      
      {/* Slide Drawer Panel */}
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        position: 'relative',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>

        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAFCFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} style={{ color: 'var(--color-purple-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
              Your Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: '#64748B' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{
          background: '#F0FDF4',
          borderBottom: '1px solid #BBF7D0',
          padding: '0.75rem 1.5rem'
        }}>
          {distanceToFreeShipping > 0 ? (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={16} /> Add ₹{distanceToFreeShipping} more to unlock <strong>FREE Delivery!</strong>
              </div>
              <div style={{ width: '100%', background: '#DCFCE7', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  background: '#16A34A',
                  height: '100%',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> Congratulations! You unlocked FREE Delivery nationwide 🎉
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#94A3B8' }}>
                <ShoppingBag size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't added any detergent packs yet.</p>
              <button onClick={onClose} className="btn-primary">Explore Products</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div 
                  key={item.cartKey}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E2E8F0',
                    background: '#FAFCFF',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain', background: 'white', borderRadius: 'var(--radius-sm)', padding: '4px' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {item.formatName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                        ₹{item.price}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                        ₹{item.mrp}
                      </span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      onClick={() => onRemoveItem(item.cartKey)}
                      style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #CBD5E1',
                      borderRadius: 'var(--radius-full)',
                      background: 'white'
                    }}>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
                        style={{ border: 'none', background: 'none', padding: '2px 8px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', padding: '0 4px' }}>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
                        style={{ border: 'none', background: 'none', padding: '2px 8px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Code Box */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter Promo Code (e.g. MISTFRESH)" 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}
              />
              <button 
                onClick={handleApplyPromo}
                style={{
                  background: 'var(--color-purple-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 1rem',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
            
            {/* Clickable Quick Coupon chips */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
              {['MISTFRESH', 'SUPER30'].map(code => (
                <button
                  key={code}
                  onClick={() => { setPromoInput(code); handleApplyPromo(); }}
                  style={{
                    background: '#E6F3FF',
                    color: '#0084FF',
                    border: '1px stroke #99D6FF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🏷️ {code}
                </button>
              ))}
            </div>

            {appliedPromo && (
              <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginTop: '0.4rem' }}>
                ✅ Coupon <strong>{appliedPromo}</strong> applied (-₹{promoDiscount})
              </div>
            )}
            {promoError && (
              <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: '600', marginTop: '0.4rem' }}>
                {promoError}
              </div>
            )}
          </div>
        )}

        {/* Footer Total Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', background: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {productDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                  <span>Product Savings</span>
                  <span>-₹{productDiscount}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Shipping</span>
                <span>{shippingCost === 0 ? <strong style={{ color: '#166534' }}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-purple-dark)', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <span>Total Payable</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout({ cartItems, subtotal, promoDiscount, shippingCost, finalTotal, appliedPromo })}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
