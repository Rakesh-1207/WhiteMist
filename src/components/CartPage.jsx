import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Plus, Minus, Tag, CheckCircle2, ArrowLeft, Layers } from 'lucide-react';
import { PROMO_CODES } from '../data/products';

export default function CartPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToProducts,
  onNavigateHome
}) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const mrpTotal = cartItems.reduce((acc, item) => acc + ((item.mrp || item.price * 1.25) * item.quantity), 0);
  const productDiscount = Math.max(0, mrpTotal - subtotal);

  // Shipping logic (Free shipping over ₹30,000 for appliances, or over ₹499 for care)
  const freeShippingThreshold = 499;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || cartItems.length === 0 ? 0 : 49;

  // Coupon Discount calculation
  let promoDiscount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === 'percent') {
      promoDiscount = Math.round((subtotal * promo.discount) / 100);
    } else if (promo.type === 'flat') {
      promoDiscount = promo.discount;
    }
  }

  const finalTotal = Math.max(0, subtotal - promoDiscount + shippingCost);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoInput.trim().toUpperCase();

    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoSuccess(`Coupon '${code}' applied! You saved ₹${PROMO_CODES[code].discount}${PROMO_CODES[code].type === 'percent' ? '%' : ''}`);
    } else {
      setPromoError("Invalid promo code. Try 'MISTWELCOME10' or 'WHITEMIST2026'");
    }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '85vh', padding: '7.5rem 0 5rem 0' }}>
      <div className="container">

        {/* Page Header & Breadcrumbs */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748B', marginBottom: '0.75rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={onNavigateHome}>Home</span>
            <span>/</span>
            <span style={{ color: 'var(--color-purple-primary)', fontWeight: '700' }}>Shopping Cart</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-purple-dark)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingBag size={32} style={{ color: 'var(--color-purple-primary)' }} />
                Your Shopping Cart
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {totalItemsCount === 0 ? 'Your cart is currently empty' : `Review your ${totalItemsCount} selected item${totalItemsCount > 1 ? 's' : ''} before checkout.`}
              </p>
            </div>

            <button
              onClick={onNavigateToProducts}
              className="btn-secondary"
              style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Layers size={16} /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #E2E8F0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#F3EBFD',
              color: 'var(--color-purple-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ShoppingBag size={44} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.5rem' }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '420px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              Looks like you haven't added any dishwashers or care accessories to your cart yet. Explore our high-efficiency appliance range!
            </p>

            <button
              onClick={onNavigateToProducts}
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              <span>Explore Dishwashers</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '2rem',
            alignItems: 'start'
          }} className="cart-page-grid">

            {/* Left Column: Cart Items List */}
            <div>

              {/* Free Shipping Progress Indicator */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                border: '1px solid #E2E8F0',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-purple-dark)', marginBottom: '0.5rem' }}>
                  <Truck size={18} style={{ color: '#16A34A' }} />
                  <span>
                    {shippingCost === 0 ? '🎉 You unlocked FREE Home Delivery & Installation!' : `Add ₹${distanceToFreeShipping} more to get FREE Delivery!`}
                  </span>
                </div>
                <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #16A34A, #0084FF)',
                    height: '100%',
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Cart Items Table Container */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden'
              }}>

                <div style={{
                  padding: '1rem 1.5rem',
                  background: '#FAFCFF',
                  borderBottom: '1px solid #E2E8F0',
                  fontWeight: '700',
                  color: '#475569',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 40px',
                  gap: '1rem',
                  alignItems: 'center'
                }} className="cart-table-header">
                  <div>Product Details</div>
                  <div style={{ textAlign: 'center' }}>Quantity</div>
                  <div style={{ textAlign: 'right' }}>Total</div>
                  <div></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', divideY: '1px solid #E2E8F0' }}>
                  {cartItems.map((item) => (
                    <div key={item.cartKey} style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid #F1F5F9',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 40px',
                      gap: '1rem',
                      alignItems: 'center'
                    }} className="cart-item-row">

                      {/* Product details info */}
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: 'var(--radius-md)',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>

                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.25rem' }}>
                            {item.name}
                          </h3>
                          <div style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '0.4rem' }}>
                            {item.formatName || 'Standard Appliance Unit'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-purple-primary)' }}>
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.mrp && item.mrp > item.price && (
                              <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ₹{item.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #CBD5E1',
                          borderRadius: 'var(--radius-full)',
                          background: '#FAFCFF',
                          padding: '2px 6px'
                        }}>
                          <button
                            onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
                            style={{
                              width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                              background: 'transparent', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', color: '#475569'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
                            style={{
                              width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                              background: 'transparent', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', color: '#475569'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Total price for item */}
                      <div style={{ textAlign: 'right', fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-purple-dark)' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>

                      {/* Delete button */}
                      <div>
                        <button
                          onClick={() => onRemoveItem(item.cartKey)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                            transition: 'color 0.2s ease', padding: '0.4rem'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #E2E8F0',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px'
            }}>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem', color: '#475569', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal MRP</span>
                  <span style={{ textDecoration: productDiscount > 0 ? 'line-through' : 'none' }}>₹{mrpTotal.toLocaleString()}</span>
                </div>

                {productDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '700' }}>
                    <span>Product Discount</span>
                    <span>-₹{productDiscount.toLocaleString()}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '700' }}>
                    <span>Coupon ({appliedPromo})</span>
                    <span>-₹{promoDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery & Installation</span>
                  <span>{shippingCost === 0 ? <strong style={{ color: '#16A34A' }}>FREE</strong> : `₹${shippingCost}`}</span>
                </div>
              </div>

              {/* Promo Code Input Box */}
              <div style={{ marginBottom: '1.5rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  <Tag size={14} style={{ color: 'var(--color-purple-primary)' }} />
                  Have a Promo Code?
                </label>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. MISTWELCOME10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="btn-accent-blue"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                </div>

                {promoError && (
                  <div style={{ color: '#EF4444', fontSize: '0.775rem', marginTop: '0.4rem', fontWeight: '600' }}>
                    ⚠️ {promoError}
                  </div>
                )}
                {promoSuccess && (
                  <div style={{ color: '#16A34A', fontSize: '0.775rem', marginTop: '0.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> {promoSuccess}
                  </div>
                )}
              </div>

              {/* Final Payable Amount */}
              <div style={{
                borderTop: '2px solid #F1F5F9',
                paddingTop: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                    Total Payable
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Inclusive of all GST taxes</div>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                  ₹{finalTotal.toLocaleString()}
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={() => onProceedToCheckout({ subtotal, mrpTotal, productDiscount, promoDiscount, shippingCost, finalTotal, items: cartItems })}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>

              {/* Security Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: '#0084FF' }} />
                  <span>100% Encrypted & Safe Checkout</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#16A34A' }} />
                  <span>Free Doorstep Delivery & Demo</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
