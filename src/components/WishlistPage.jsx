import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star, Sparkles } from 'lucide-react';

export default function WishlistPage({ wishlistItems, onToggleWishlist, onAddToCart, onNavigateToProducts }) {
  return (
    <div style={{ padding: '7.5rem 0 5rem 0', background: '#FAFCFF', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F01262', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Heart size={18} fill="#F01262" /> SAVED ITEMS
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginTop: '0.25rem' }}>
              My Saved Wishlist ({wishlistItems.length})
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <button 
              onClick={onNavigateToProducts}
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Wishlist Items List */}
        {wishlistItems.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#FFEBF2',
              color: '#F01262',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Heart size={44} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.5rem' }}>
              Your Wishlist is Empty
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Explore our liquid detergents, eco refill pouches, and fabric conditioners and tap the heart icon to save your favorite products!
            </p>

            <button 
              onClick={onNavigateToProducts}
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              <span>Explore Products Catalogue</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {wishlistItems.map((product) => {
              const defaultFormat = product.formats[0];

              return (
                <div key={product.id} className="product-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Remove Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge-primary" style={{ background: product.accentColor }}>
                      {product.categoryName}
                    </span>
                    <button
                      onClick={() => onToggleWishlist(product)}
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Image Stage */}
                  <div style={{
                    height: '220px',
                    background: product.bgGradient,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <img 
                      src={defaultFormat.image} 
                      alt={product.name}
                      style={{ maxHeight: '180px', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.12))' }}
                    />
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                    <Star size={15} fill="#FFB800" stroke="none" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>{product.rating}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flexGrow: 1 }}>
                    {product.tagline}
                  </p>

                  {/* Footer Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                          ₹{defaultFormat.price}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                          ₹{defaultFormat.mrp}
                        </span>
                      </div>
                      <span className="badge-discount">{defaultFormat.discount}</span>
                    </div>

                    <button
                      onClick={(e) => onAddToCart(product, defaultFormat, e)}
                      className="btn-primary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                    >
                      <ShoppingBag size={15} />
                      <span>Move to Cart</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
