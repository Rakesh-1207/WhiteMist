import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Layers, Home, Calculator, Award, Star } from 'lucide-react';

export default function Navbar({ cartCount, wishlistCount, onOpenCart, activeView, setActiveView, searchQuery, setSearchQuery, cartBadgeRef }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view, anchorId) => {
    setMobileMenuOpen(false);
    setActiveView(view);
    if (anchorId && view === 'home') {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Main Glass Header (Transparent at top, Transparent Glass on Scroll) */}
      <header className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img 
              src="/assets/images/logo.png" 
              alt="Meridian White Mist Logo" 
              style={{ height: '42px', objectFit: 'contain' }} 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }} className="desktop-nav">
            <button 
              onClick={() => handleNavClick('home')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: activeView === 'home' ? '700' : '600',
                color: activeView === 'home' ? 'var(--color-purple-primary)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              Home
            </button>

            <button 
              onClick={() => handleNavClick('products')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: activeView === 'products' ? '700' : '600',
                color: activeView === 'products' ? 'var(--color-purple-primary)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Layers size={16} /> Liquid Detergents
            </button>

            <button 
              onClick={() => onOpenServiceModal && onOpenServiceModal('quote')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              Bulk Order Quote
            </button>

            <button 
              onClick={() => onOpenServiceModal && onOpenServiceModal('service')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              Request Free Sample
            </button>

            <button 
              onClick={() => handleNavClick('home', 'stain-calculator')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              Dose Guide
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Search Input Toggle */}
            <div style={{ position: 'relative' }}>
              {showSearch ? (
                <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.8rem' }}>
                  <Search size={16} style={{ color: '#64748B' }} />
                  <input 
                    type="text" 
                    placeholder="Search fragrance, pouch..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeView !== 'products') setActiveView('products');
                    }}
                    style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '0.5rem', fontSize: '0.85rem', width: '140px' }}
                    autoFocus
                  />
                  <X size={16} style={{ cursor: 'pointer', color: '#64748B' }} onClick={() => { setShowSearch(false); setSearchQuery(''); }} />
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setShowSearch(true);
                    if (activeView !== 'products') setActiveView('products');
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-main)' }}
                  title="Search Products"
                >
                  <Search size={22} />
                </button>
              )}
            </div>

            {/* Wishlist Button with Counter */}
            <button 
              onClick={() => handleNavClick('wishlist')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '0.4rem', 
                color: activeView === 'wishlist' ? '#F01262' : 'var(--text-main)', 
                position: 'relative' 
              }}
              title="Wishlist"
            >
              <Heart size={22} fill={wishlistCount > 0 ? "#F01262" : "none"} style={{ color: wishlistCount > 0 ? "#F01262" : "inherit" }} />
              {wishlistCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '-2px',
                    background: '#F01262',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '0.7rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              ref={cartBadgeRef}
              onClick={onOpenCart}
              className="btn-primary"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                position: 'relative'
              }}
            >
              <ShoppingBag size={18} />
              <span className="cart-text">Cart</span>
              <span 
                className="cart-badge-count"
                style={{
                  background: '#FFB800',
                  color: '#1E1B4B',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  marginLeft: '0.2rem'
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.4rem',
                color: 'var(--text-main)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="mobile-hamburger"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </header>

      {/* Touch-Friendly Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column'
        }} onClick={() => setMobileMenuOpen(false)}>
          
          <div style={{
            background: 'white',
            padding: '2rem 1.5rem',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderBottomRightRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'slideInRight 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
              <img src="/assets/images/logo.png" alt="Meridian White Mist" style={{ height: '36px', objectFit: 'contain' }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            <button 
              onClick={() => handleNavClick('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeView === 'home' ? '#F3EBFD' : '#F8FAFC',
                color: activeView === 'home' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              <Home size={20} style={{ color: 'var(--color-purple-primary)' }} />
              <span>Home</span>
            </button>

            <button 
              onClick={() => handleNavClick('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeView === 'products' ? '#F3EBFD' : '#F8FAFC',
                color: activeView === 'products' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              <Layers size={20} style={{ color: 'var(--color-purple-primary)' }} />
              <span>All Products Catalogue</span>
            </button>

            <button 
              onClick={() => handleNavClick('home', 'stain-calculator')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: '#F8FAFC',
                color: 'var(--text-main)',
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              <Calculator size={20} style={{ color: '#0084FF' }} />
              <span>Smart Dose Calculator</span>
            </button>

            <button 
              onClick={() => handleNavClick('home', 'why-white-mist')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: '#F8FAFC',
                color: 'var(--text-main)',
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              <Award size={20} style={{ color: '#16A34A' }} />
              <span>Why White Mist</span>
            </button>

            <button 
              onClick={() => handleNavClick('home', 'reviews')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: '#F8FAFC',
                color: 'var(--text-main)',
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              <Star size={20} style={{ color: '#FFB800' }} />
              <span>Customer Reviews</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}
