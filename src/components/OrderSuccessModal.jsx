import React, { useEffect } from 'react';
import { CheckCircle2, PackageCheck, Truck, Download, ShoppingBag, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessModal({ orderDetails, onContinueShopping }) {
  if (!orderDetails) return null;

  useEffect(() => {
    // Fire festive celebration confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '650px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        position: 'relative',
        animation: 'bounceIn 0.4s ease'
      }}>
        
        {/* Celebration Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem' }}>
          Order Confirmed! 🎉
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Thank you, <strong>{orderDetails.customerName}</strong>! Your order has been placed successfully.
        </p>

        {/* Order Details Badge Grid */}
        <div style={{
          background: '#FAFCFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          textAlign: 'left',
          marginBottom: '1.75rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Order Reference ID</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-purple-primary)' }}>{orderDetails.orderId}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Expected Delivery</span>
              <strong style={{ fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={15} /> Within 2 Business Days
              </strong>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Delivery Address:</span>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{orderDetails.address}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
            <span>Payment Method: <strong>{orderDetails.paymentMethod}</strong></span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>Total Paid: ₹{orderDetails.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={onContinueShopping}
            className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
          >
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
}
