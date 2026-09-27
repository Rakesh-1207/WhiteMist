import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, QrCode, Building, Banknote, ArrowLeft, CheckCircle2, Truck, Sparkles } from 'lucide-react';

export default function CheckoutPage({ cartSummary, onBackToCart, onOrderSuccess }) {
  const { cartItems, subtotal, promoDiscount, shippingCost, finalTotal, appliedPromo } = cartSummary;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pincode: '',
    city: 'Bangalore',
    address: '',
    landmark: '',
    addressType: 'home'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking, cod
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit Phone Number is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) newErrors.pincode = 'Valid 6-digit Pincode is required';
    if (!formData.address.trim()) newErrors.address = 'Street Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing latency
    setTimeout(() => {
      setIsProcessing(false);
      onOrderSuccess({
        orderId: `WM-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: formData.fullName,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone,
        items: cartItems,
        total: finalTotal,
        paymentMethod: paymentMethod.toUpperCase(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }, 1800);
  };

  return (
    <div style={{ padding: '7.5rem 0 5rem 0', background: '#FAFCFF', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Back Button & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={onBackToCart}
            style={{
              background: 'white',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Cart
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
            Checkout & Payment
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem'
          }} className="checkout-grid">

            {/* Left Column: Shipping & Payment Options */}
            <div>
              
              {/* Step 1: Shipping Address */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-purple-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                    1
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                    Shipping & Delivery Details
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="e.g. Priya Sharma"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: errors.fullName ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    {errors.fullName && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.fullName}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: errors.phone ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    {errors.phone && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.phone}</span>}
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Flat / House No. / Street Address *
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      placeholder="House/Flat No., Building Name, Street"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: errors.address ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    {errors.address && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.address}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Pincode *
                    </label>
                    <input 
                      type="text" 
                      name="pincode"
                      placeholder="e.g. 560001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: errors.pincode ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    {errors.pincode && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.pincode}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      City / Region
                    </label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        background: '#F8FAFC'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Selectable Payment Method Cards */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-purple-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                    2
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                    Payment Options
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  
                  {/* UPI Option */}
                  <div 
                    onClick={() => setPaymentMethod('upi')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'upi' ? '2px solid #0084FF' : '1px solid #E2E8F0',
                      background: paymentMethod === 'upi' ? '#E6F3FF' : '#FAFCFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <QrCode size={24} style={{ color: '#0084FF' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>UPI / QR Code</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>

                  {/* Card Option */}
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'card' ? '2px solid #0084FF' : '1px solid #E2E8F0',
                      background: paymentMethod === 'card' ? '#E6F3FF' : '#FAFCFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <CreditCard size={24} style={{ color: '#3F1B85' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Credit / Debit Card</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</div>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div 
                    onClick={() => setPaymentMethod('netbanking')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'netbanking' ? '2px solid #0084FF' : '1px solid #E2E8F0',
                      background: paymentMethod === 'netbanking' ? '#E6F3FF' : '#FAFCFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Building size={24} style={{ color: '#16A34A' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Net Banking</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All Indian Banks</div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'cod' ? '2px solid #0084FF' : '1px solid #E2E8F0',
                      background: paymentMethod === 'cod' ? '#E6F3FF' : '#FAFCFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Banknote size={24} style={{ color: '#D97706' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay cash at your doorstep</div>
                    </div>
                  </div>

                </div>

                {/* Dynamic Payment Details Panel */}
                {paymentMethod === 'upi' && (
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                      Enter VPA / UPI ID:
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. mobileNumber@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600', marginTop: '0.4rem' }}>
                      ⚡ QR Code auto-scan will be generated upon clicking Place Order.
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Card Number</label>
                      <input type="text" placeholder="4532 •••• •••• 8910" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>CVV</label>
                      <input type="password" placeholder="•••" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: '100px'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
                  Order Summary
                </h3>

                {/* Items Mini List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div key={item.cartKey} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                      <div style={{ fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', padding: '0.75rem 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: '600' }}>
                      <span>Promo Discount ({appliedPromo})</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Delivery Charges</span>
                    <span>{shippingCost === 0 ? <strong style={{ color: '#166534' }}>FREE</strong> : `₹${shippingCost}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-purple-dark)', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <span>Total Amount</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.05rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #0084FF 0%, #00C6FF 100%)',
                    boxShadow: '0 8px 20px rgba(0, 132, 255, 0.35)'
                  }}
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Place Order (₹{finalTotal})</span>
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} style={{ color: '#166534' }} /> 256-Bit SSL Encrypted & 100% Safe Checkout
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
