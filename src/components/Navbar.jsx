import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Heart, Menu, X, Layers, Home, Calculator, Award, Star, User, ChevronDown, Package, MapPin, LogOut, FileText, Gift } from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenServiceModal, 
  activeView, 
  setActiveView, 
  searchQuery, 
  setSearchQuery, 
  cartBadgeRef,
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showUserDropdown]);

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
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -70, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
              style={{ height: '46px', objectFit: 'contain' }} 
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
              className={`nav-link-btn ${activeView === 'home' ? 'active' : ''}`}
            >
              Home
            </button>

            <button 
              onClick={() => handleNavClick('products')}
              className={`nav-link-btn ${activeView === 'products' ? 'active' : ''}`}
            >
              Liquid Detergents
            </button>

            <button 
              onClick={() => onOpenServiceModal && onOpenServiceModal('quote')}
              className="nav-link-btn"
            >
              Bulk Order Quote
            </button>

            <button 
              onClick={() => onOpenServiceModal && onOpenServiceModal('service')}
              className="nav-link-btn"
            >
              Request Free Sample
            </button>

            <button 
              onClick={() => handleNavClick('home', 'stain-calculator')}
              className="nav-link-btn"
            >
              Dose Guide
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            
            {/* Search Input Toggle */}
            <div style={{ position: 'relative' }}>
              {showSearch ? (
                <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.75rem' }}>
                  <Search size={16} style={{ color: '#64748B' }} />
                  <input 
                    type="text" 
                    placeholder="Search fragrance, pouch..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeView !== 'products') setActiveView('products');
                    }}
                    style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '0.5rem', fontSize: '0.84rem', width: '150px', fontWeight: '400' }}
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                  title="Search Products"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Cart Button - Simple Icon without Background (matching user reference) */}
            <button 
              ref={cartBadgeRef}
              onClick={onOpenCart}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '0.45rem',
                color: activeView === 'cart' ? 'var(--color-purple-primary)' : '#1E293B',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 0,
                transition: 'transform 0.18s ease, color 0.18s ease'
              }}
              title={`Cart (${cartCount} items)`}
              aria-label={`Cart with ${cartCount} items`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ShoppingCart size={23} strokeWidth={2.2} />
              {cartCount > 0 && (
                <span 
                  className="cart-badge-count"
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-5px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.68rem',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1,
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                    border: '2px solid #FFFFFF',
                    pointerEvents: 'none'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Icon - Default Human Silhouette / Shadow Icon Only */}
            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{
                    background: activeView === 'profile' ? '#F3EBFD' : 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '0.45rem',
                    color: activeView === 'profile' ? 'var(--color-purple-primary)' : '#1E293B',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 0,
                    transition: 'transform 0.18s ease, color 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.color = 'var(--color-purple-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.color = activeView === 'profile' ? 'var(--color-purple-primary)' : '#1E293B';
                  }}
                  title={`Account Profile (${user.full_name || 'My Account'})`}
                  aria-label="Account Profile"
                >
                  <User size={23} strokeWidth={2.2} />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 12px)',
                      right: 0,
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0 20px 45px -10px rgba(39, 13, 91, 0.22), 0 0 0 1px rgba(226, 232, 240, 0.9)',
                      border: '1px solid #E2E8F0',
                      width: '230px',
                      padding: '0.55rem',
                      zIndex: 1500,
                      animation: 'fadeInUp 0.2s ease'
                    }}
                  >
                    <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {user.full_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenProfile && onOpenProfile('orders'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <Package size={16} style={{ color: 'var(--color-purple-primary)' }} />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenProfile && onOpenProfile('wishlist'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Heart size={16} style={{ color: '#F01262' }} />
                        <span>My Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span style={{
                          background: '#FFEBF2',
                          color: '#F01262',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '1px 7px',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenProfile && onOpenProfile('addresses'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <MapPin size={16} style={{ color: '#0084FF' }} />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenProfile && onOpenProfile('details'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <User size={16} style={{ color: '#16A34A' }} />
                      <span>Profile Details</span>
                    </button>

                    <div style={{ borderTop: '1px solid #F1F5F9', margin: '0.35rem 0' }} />

                    <button
                      onClick={() => { setShowUserDropdown(false); onLogout && onLogout(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                style={{
                  background: activeView === 'auth' ? '#F3EBFD' : 'transparent',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.45rem',
                  color: activeView === 'auth' ? 'var(--color-purple-primary)' : '#1E293B',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 0,
                  transition: 'transform 0.18s ease, color 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.color = 'var(--color-purple-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = activeView === 'auth' ? 'var(--color-purple-primary)' : '#1E293B';
                }}
                title="Sign In / Register"
                aria-label="Sign In or Register"
              >
                <User size={23} strokeWidth={2.2} />
              </button>
            )}

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

      {/* Premium Right-Side Slide-Over Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'drawerFadeIn 0.25s ease'
          }} 
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Right-Side Drawer Panel */}
          <div 
            className="mobile-drawer-panel"
            style={{
              width: 'min(340px, 86vw)',
              height: '100dvh',
              background: '#FFFFFF',
              boxShadow: '-15px 0 45px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'drawerSlideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.25rem 1rem 1.25rem',
              borderBottom: '1px solid #F1F5F9'
            }}>
              <div 
                onClick={() => handleNavClick('home')} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <img 
                  src="/assets/images/logo.png" 
                  alt="Meridian White Mist" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
              </div>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem 1.1rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <button 
                onClick={() => handleNavClick('home')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeView === 'home' ? '#F3EBFD' : 'transparent',
                  color: activeView === 'home' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeView === 'home' ? '700' : '500',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <Home size={19} style={{ color: activeView === 'home' ? 'var(--color-purple-primary)' : '#64748B' }} />
                <span>Home</span>
              </button>

              <button 
                onClick={() => handleNavClick('products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeView === 'products' ? '#F3EBFD' : 'transparent',
                  color: activeView === 'products' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeView === 'products' ? '700' : '500',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <Layers size={19} style={{ color: activeView === 'products' ? 'var(--color-purple-primary)' : '#64748B' }} />
                <span>All Products Catalogue</span>
              </button>

              <button 
                onClick={() => handleNavClick('home', 'stain-calculator')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <Calculator size={19} style={{ color: '#0084FF' }} />
                <span>Smart Dose Calculator</span>
              </button>

              <button 
                onClick={() => handleNavClick('home', 'why-white-mist')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <Award size={19} style={{ color: '#16A34A' }} />
                <span>Why White Mist</span>
              </button>

              <button 
                onClick={() => handleNavClick('home', 'reviews')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <Star size={19} style={{ color: '#FFB800' }} />
                <span>Customer Reviews</span>
              </button>

              <div style={{ height: '1px', background: '#F1F5F9', margin: '0.5rem 0' }} />

              {/* Account & Quick Actions */}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile && onOpenProfile('orders');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-purple-primary)',
                      background: '#F3EBFD',
                      color: 'var(--color-purple-dark)',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <User size={20} style={{ color: 'var(--color-purple-primary)' }} />
                      <div>
                        <div>{user.full_name}</div>
                        <div style={{ fontSize: '0.74rem', fontWeight: '500', color: '#64748B' }}>View Orders & Profile</div>
                      </div>
                    </div>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </button>

                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile && onOpenProfile('wishlist');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Heart size={19} style={{ color: '#F01262' }} />
                      <span>My Saved Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span style={{
                        background: '#FFEBF2',
                        color: '#F01262',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout && onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'transparent',
                      color: '#DC2626',
                      fontWeight: '600',
                      fontSize: '0.88rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={19} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-purple-primary)',
                    background: '#F3EBFD',
                    color: 'var(--color-purple-dark)',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <User size={20} style={{ color: 'var(--color-purple-primary)' }} />
                  <span>Sign In / Create Account</span>
                </button>
              )}

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenServiceModal) onOpenServiceModal('quote');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <FileText size={18} style={{ color: 'var(--color-purple-primary)' }} />
                <span>Bulk Order Quotation</span>
              </button>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenServiceModal) onOpenServiceModal('service');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Gift size={18} style={{ color: '#F01262' }} />
                <span>Request Free Sample</span>
              </button>
            </div>

            {/* Drawer Footer Note */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid #F1F5F9',
              fontSize: '0.72rem',
              color: '#94A3B8',
              textAlign: 'center'
            }}>
              Meridian White Mist • Premium Care
            </div>
          </div>
        </div>
      )}
    </>
  );
}
