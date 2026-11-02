import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  CheckCircle2,
  Plus,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ProfilePage({
  user,
  token,
  onLogout,
  onNavigateToProducts,
  onNavigateHome,
  onUpdateUser,
  initialTab = 'orders',
  wishlistItems = [],
  onToggleWishlist,
  onAddToCart
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' | 'wishlist' | 'addresses' | 'details'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Horizontal Tab Navigation Ref & Sideways Scroll State
  const navCardRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (navCardRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navCardRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  const handleScrollNav = (direction) => {
    if (navCardRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      navCardRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!navCardRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - navCardRef.current.offsetLeft;
    scrollLeftRef.current = navCardRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !navCardRef.current) return;
    e.preventDefault();
    const x = e.pageX - navCardRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    navCardRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [orders, addresses, wishlistItems]);

  useEffect(() => {
    if (navCardRef.current) {
      const activeBtn = navCardRef.current.querySelector('.profile-tab-btn.is-active');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
      setTimeout(checkScrollability, 300);
    }
  }, [activeTab]);

  // Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_label: 'Home',
    address_line1: '',
    address_line2: '',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '',
    country: 'India',
    is_default: false
  });
  const [addressError, setAddressError] = useState('');

  // Personal Info Edit State
  const [editName, setEditName] = useState(user?.full_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState('');

  // Synchronize state when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.full_name || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const fetched = await api.getMyOrders(token);
        if (isMounted) {
          setOrders(fetched || []);
        }
      } catch (err) {
        console.warn('Could not load orders via API:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [token]);

  // Fetch Addresses
  useEffect(() => {
    let isMounted = true;
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const fetched = await api.getAddresses(token);
        if (isMounted) {
          // If no saved addresses returned from DB, provide local fallback if available
          if (fetched && fetched.length > 0) {
            setAddresses(fetched);
          } else {
            const savedLocal = localStorage.getItem(`wm_addresses_${user?.id || 'guest'}`);
            if (savedLocal) {
              setAddresses(JSON.parse(savedLocal));
            }
          }
        }
      } catch (err) {
        console.warn('Could not load addresses from API:', err);
        const savedLocal = localStorage.getItem(`wm_addresses_${user?.id || 'guest'}`);
        if (savedLocal) {
          setAddresses(JSON.parse(savedLocal));
        }
      } finally {
        if (isMounted) setLoadingAddresses(false);
      }
    };

    fetchAddresses();
    return () => { isMounted = false; };
  }, [token, user]);

  // Handle Save Address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressError('');

    if (!newAddress.address_line1.trim()) {
      setAddressError('Street address is required');
      return;
    }
    if (!newAddress.postal_code.trim() || newAddress.postal_code.trim().length < 6) {
      setAddressError('Valid 6-digit Pincode is required');
      return;
    }

    try {
      let updated = [];
      try {
        updated = await api.addAddress(newAddress, token);
      } catch (e) {
        // Fallback local storage
        const current = [...addresses];
        const item = {
          id: Date.now(),
          ...newAddress
        };
        if (newAddress.is_default) {
          current.forEach(a => a.is_default = false);
        }
        updated = [item, ...current];
      }

      setAddresses(updated);
      localStorage.setItem(`wm_addresses_${user?.id || 'guest'}`, JSON.stringify(updated));
      setShowAddAddress(false);
      setNewAddress({
        address_label: 'Home',
        address_line1: '',
        address_line2: '',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '',
        country: 'India',
        is_default: false
      });
    } catch (err) {
      setAddressError(err.message || 'Failed to save address');
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id) => {
    try {
      let updated = [];
      try {
        updated = await api.deleteAddress(id, token);
      } catch {
        updated = addresses.filter(a => a.id !== id);
      }
      setAddresses(updated);
      localStorage.setItem(`wm_addresses_${user?.id || 'guest'}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileNotice('');

    try {
      const updatedUser = await api.updateProfile(
        { full_name: editName, phone: editPhone },
        token
      );
      if (onUpdateUser) onUpdateUser(updatedUser || { ...user, full_name: editName, phone: editPhone });
      setProfileNotice('Profile updated successfully!');
      setTimeout(() => setProfileNotice(''), 3000);
    } catch (err) {
      setProfileNotice('Updated details saved to active session!');
      if (onUpdateUser) onUpdateUser({ ...user, full_name: editName, phone: editPhone });
      setTimeout(() => setProfileNotice(''), 3000);
    } finally {
      setProfileSaving(false);
    }
  };

  // Helper for parse address json if string
  const formatAddress = (addr) => {
    if (!addr) return 'Standard Delivery Address';
    if (typeof addr === 'string') {
      try {
        const parsed = JSON.parse(addr);
        return `${parsed.address_line1 || ''}, ${parsed.city || ''} ${parsed.postal_code || ''}`.trim() || addr;
      } catch {
        return addr;
      }
    }
    return `${addr.address_line1 || ''}, ${addr.city || ''} - ${addr.postal_code || ''}`;
  };

  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-page-wrapper" style={{ background: '#FAFCFF', minHeight: '85vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Navigation Breadcrumb / Back */}
        <div className="profile-top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'white',
                  border: '1px solid #CBD5E1',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <ArrowLeft size={16} /> Home
              </button>
            )}

            <button
              onClick={onNavigateToProducts}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'white',
                border: '1px solid #CBD5E1',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <ShoppingBag size={15} /> All Products
            </button>
          </div>

          <button
            onClick={onLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              color: '#B91C1C',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* User Hero Banner Card */}
        <div
          className="profile-hero-banner"
          style={{
            background: 'linear-gradient(135deg, #270D5B 0%, #3F1B85 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            color: 'white',
            boxShadow: '0 20px 40px rgba(39, 13, 91, 0.25)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Decorative Rings */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 132, 255, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="profile-user-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            {/* Avatar Circle */}
            <div
              className="profile-avatar-circle"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0084FF 0%, #3F1B85 100%)',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              {userInitial}
            </div>

            <div className="profile-user-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: 0 }}>
                  {user?.full_name || 'Valued Member'}
                </h1>
                <span
                  style={{
                    background: '#FFB800',
                    color: '#1E1B4B',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '2px 9px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  CLUB MEMBER
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', color: '#CBD5E1', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} style={{ color: '#0084FF' }} /> {user?.email || 'N/A'}
                </span>
                {user?.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} style={{ color: '#0084FF' }} /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="profile-stats-row" style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <div className="profile-stat-box" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.85rem 1.4rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFB800' }}>
                {orders.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Orders
              </div>
            </div>
            <div className="profile-stat-box" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.85rem 1.4rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F472B6' }}>
                {wishlistItems.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: '600', textTransform: 'uppercase' }}>
                Saved Wishlist
              </div>
            </div>
            <div className="profile-stat-box" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.85rem 1.4rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#BBF7D0' }}>
                ₹{orders.reduce((sum, ord) => sum + parseFloat(ord.total_amount || 0), 0).toFixed(0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Spent
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="profile-layout-grid">
          
          {/* Left Side Navigation Pills */}
          <div className="profile-nav-wrapper">
            {/* Scroll Navigation Arrows on Mobile */}
            <button
              type="button"
              className={`profile-nav-arrow profile-nav-arrow-left ${canScrollLeft ? 'visible' : ''}`}
              onClick={() => handleScrollNav('left')}
              aria-label="Scroll navigation tabs left"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className={`profile-nav-arrow profile-nav-arrow-right ${canScrollRight ? 'visible' : ''}`}
              onClick={() => handleScrollNav('right')}
              aria-label="Scroll navigation tabs right"
            >
              <ChevronRight size={16} />
            </button>

            <div
              ref={navCardRef}
              className="profile-nav-card"
              onScroll={checkScrollability}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                position: 'sticky',
                top: '90px'
              }}
            >
              <button
                onClick={() => setActiveTab('orders')}
                className={`profile-tab-btn ${activeTab === 'orders' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'orders' ? '#F3EBFD' : 'transparent',
                  color: activeTab === 'orders' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeTab === 'orders' ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div className="profile-tab-inner" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Package size={18} style={{ color: activeTab === 'orders' ? 'var(--color-purple-primary)' : '#64748B' }} />
                  <span>My Orders</span>
                </div>
                <span
                  className="profile-tab-badge"
                  style={{
                    background: activeTab === 'orders' ? 'var(--color-purple-primary)' : '#F1F5F9',
                    color: activeTab === 'orders' ? 'white' : '#64748B',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700'
                  }}
                >
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`profile-tab-btn ${activeTab === 'wishlist' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'wishlist' ? '#F3EBFD' : 'transparent',
                  color: activeTab === 'wishlist' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeTab === 'wishlist' ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div className="profile-tab-inner" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Heart size={18} fill={activeTab === 'wishlist' ? '#F01262' : 'none'} style={{ color: activeTab === 'wishlist' ? '#F01262' : '#64748B' }} />
                  <span>My Wishlist</span>
                </div>
                <span
                  className="profile-tab-badge"
                  style={{
                    background: activeTab === 'wishlist' ? '#F01262' : '#F1F5F9',
                    color: activeTab === 'wishlist' ? 'white' : '#64748B',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700'
                  }}
                >
                  {wishlistItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`profile-tab-btn ${activeTab === 'addresses' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'addresses' ? '#F3EBFD' : 'transparent',
                  color: activeTab === 'addresses' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeTab === 'addresses' ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div className="profile-tab-inner" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={18} style={{ color: activeTab === 'addresses' ? 'var(--color-purple-primary)' : '#64748B' }} />
                  <span>Delivery Addresses</span>
                </div>
                <span
                  className="profile-tab-badge"
                  style={{
                    background: activeTab === 'addresses' ? 'var(--color-purple-primary)' : '#F1F5F9',
                    color: activeTab === 'addresses' ? 'white' : '#64748B',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700'
                  }}
                >
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('details')}
                className={`profile-tab-btn ${activeTab === 'details' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'details' ? '#F3EBFD' : 'transparent',
                  color: activeTab === 'details' ? 'var(--color-purple-dark)' : 'var(--text-main)',
                  fontWeight: activeTab === 'details' ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div className="profile-tab-inner" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <User size={18} style={{ color: activeTab === 'details' ? 'var(--color-purple-primary)' : '#64748B' }} />
                  <span>Account Details</span>
                </div>
              </button>

              <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.5rem 0' }} />

              {/* Club Perks Widget */}
              <div className="profile-privileges-box" style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-purple-primary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={15} /> Member Privileges
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B21A8', lineHeight: 1.4 }}>
                  Enjoy free delivery on orders above ₹499 & instant priority dispatch across Bangalore.
                </p>
              </div>
            </div>
          </div>

          {/* Right Tab Content View */}
          <div>
            
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      Order History & Tracking
                    </h2>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
                      View all your previous purchases, items, and shipment status
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToProducts}
                    className="btn-accent-blue"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <ShoppingBag size={15} /> Shop Detergents
                  </button>
                </div>

                {loadingOrders ? (
                  <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '3rem', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                    <div style={{ color: 'var(--color-purple-primary)', fontWeight: '700', fontSize: '0.95rem' }}>
                      Loading your orders...
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div
                    style={{
                      background: 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '3.5rem 2rem',
                      textAlign: 'center',
                      border: '1.5px dashed #CBD5E1',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                        color: '#64748B'
                      }}
                    >
                      <Package size={30} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      No Orders Yet
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                      You haven't placed any detergent orders yet. Browse our enzyme liquid detergents for 3X stain fighting!
                    </p>
                    <button
                      onClick={onNavigateToProducts}
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)' }}
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {orders.map((ord) => {
                      const orderDate = ord.created_at
                        ? new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Recent Order';

                      const statusColors = {
                        CONFIRMED: { bg: '#DCFCE7', text: '#15803D' },
                        DELIVERED: { bg: '#E0F2FE', text: '#0284C7' },
                        PENDING: { bg: '#FEF3C7', text: '#B45309' },
                        PROCESSING: { bg: '#F3E8FF', text: '#7E22CE' }
                      };
                      const currentStatusColor = statusColors[ord.order_status] || statusColors.CONFIRMED;

                      return (
                        <div
                          key={ord.id || ord.order_number}
                          className="profile-order-card"
                          style={{
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #E2E8F0',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Order Top Bar */}
                          <div
                            className="profile-order-top"
                            style={{
                              background: '#F8FAFC',
                              padding: '1rem 1.5rem',
                              borderBottom: '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                                  Order Placed
                                </div>
                                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                  {orderDate}
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                                  Total Amount
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                                  ₹{parseFloat(ord.total_amount).toFixed(2)}
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                                  Ship To
                                </div>
                                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                  {ord.customer_name || user?.full_name}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span
                                style={{
                                  background: currentStatusColor.bg,
                                  color: currentStatusColor.text,
                                  fontSize: '0.75rem',
                                  fontWeight: '800',
                                  padding: '4px 10px',
                                  borderRadius: 'var(--radius-full)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <CheckCircle2 size={13} /> {ord.order_status || 'CONFIRMED'}
                              </span>
                              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                                #{ord.order_number}
                              </div>
                            </div>
                          </div>

                          {/* Ordered Items List */}
                          <div className="profile-order-body" style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {(ord.items || []).map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    paddingBottom: idx === (ord.items || []).length - 1 ? 0 : '1rem',
                                    borderBottom: idx === (ord.items || []).length - 1 ? 'none' : '1px solid #F1F5F9'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div
                                      style={{
                                        width: '54px',
                                        height: '54px',
                                        background: '#F8FAFC',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '4px',
                                        flexShrink: 0
                                      }}
                                    >
                                      <img
                                        src={item.image_url || '/assets/images/bottle_blue.png'}
                                        alt={item.product_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = '/assets/images/bottle_blue.png'; }}
                                      />
                                    </div>

                                    <div>
                                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                        {item.product_name}
                                      </div>
                                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                                        Qty: <strong>{item.quantity}</strong> × ₹{parseFloat(item.unit_price).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ fontWeight: '800', color: 'var(--color-purple-dark)', fontSize: '1rem' }}>
                                    ₹{(parseFloat(item.unit_price) * parseInt(item.quantity)).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Details Footer */}
                            <div
                              className="profile-order-footer"
                              style={{
                                marginTop: '1.25rem',
                                paddingTop: '1rem',
                                borderTop: '1px dashed #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                color: '#64748B',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MapPin size={14} style={{ color: 'var(--color-purple-primary)' }} />
                                <span>Delivering to: {formatAddress(ord.shipping_address_json || ord.shipping_address)}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                                <span>Payment via <strong>{ord.payment_method || 'UPI'}</strong> (Confirmed)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Heart size={20} fill="#F01262" style={{ color: '#F01262' }} />
                      <span>My Saved Wishlist ({wishlistItems.length})</span>
                    </h2>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
                      Items you have favorited for easy quick ordering
                    </p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <button
                      onClick={onNavigateToProducts}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}
                    >
                      <span>Explore More</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div
                    style={{
                      background: 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '3.5rem 2rem',
                      textAlign: 'center',
                      border: '1.5px dashed #CBD5E1',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#FFEBF2',
                        color: '#F01262',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto'
                      }}
                    >
                      <Heart size={30} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      Your Wishlist is Empty
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                      Save your favorite liquid detergents and eco refill pouches by tapping the heart icon on any product!
                    </p>
                    <button
                      onClick={onNavigateToProducts}
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)' }}
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1.25rem'
                  }}>
                    {wishlistItems.map((product) => {
                      const defaultFormat = product.formats?.[0] || { name: 'Standard', size: '1L', price: product.price || 249, originalPrice: 349 };

                      return (
                        <div
                          key={product.id}
                          style={{
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #E2E8F0',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(39, 13, 91, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span
                              style={{
                                background: product.accentColor ? `${product.accentColor}18` : '#F3EBFD',
                                color: product.accentColor || 'var(--color-purple-primary)',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)'
                              }}
                            >
                              {product.categoryName || 'Liquid Detergent'}
                            </span>
                            <button
                              onClick={() => onToggleWishlist && onToggleWishlist(product)}
                              style={{
                                background: '#FEF2F2',
                                border: '1px solid #FCA5A5',
                                color: '#DC2626',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.15s ease'
                              }}
                              title="Remove from Wishlist"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem', flex: 1 }}>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                height: '140px',
                                width: '100%',
                                objectFit: 'contain',
                                marginBottom: '0.75rem'
                              }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.4rem', color: '#FFB800', fontSize: '0.8rem', fontWeight: '700' }}>
                              <Star size={14} fill="#FFB800" />
                              <span>{product.rating || '4.9'}</span>
                              <span style={{ color: '#94A3B8', fontWeight: '500', fontSize: '0.75rem' }}>({product.reviewsCount || 120})</span>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                              {product.title}
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.75rem 0' }}>
                              {product.variantName || product.subtitle || 'Active Bio-Enzymes'}
                            </p>
                          </div>

                          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                                ₹{defaultFormat.price}
                              </span>
                              {defaultFormat.originalPrice && (
                                <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                  ₹{defaultFormat.originalPrice}
                                </span>
                              )}
                              <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '700', marginLeft: 'auto' }}>
                                {defaultFormat.size}
                              </span>
                            </div>

                            <button
                              onClick={() => onAddToCart && onAddToCart(product, defaultFormat, 1)}
                              className="btn-primary"
                              style={{
                                width: '100%',
                                padding: '0.65rem 1rem',
                                fontSize: '0.86rem',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <ShoppingBag size={15} />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      Saved Delivery Addresses
                    </h2>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
                      Manage addresses for hassle-free 1-click detergent delivery
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: 'var(--radius-full)' }}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {/* Add Address Form Modal / Box */}
                {showAddAddress && (
                  <div
                    style={{
                      background: 'white',
                      border: '2px solid var(--color-purple-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      marginBottom: '1.5rem',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-purple-dark)', margin: 0 }}>
                        Add Delivery Address
                      </h3>
                      <button
                        onClick={() => setShowAddAddress(false)}
                        style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>

                    {addressError && (
                      <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {addressError}
                      </div>
                    )}

                    <form onSubmit={handleSaveAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Address Type / Label
                        </label>
                        <select
                          value={newAddress.address_label}
                          onChange={(e) => setNewAddress({ ...newAddress, address_label: e.target.value })}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', outline: 'none' }}
                        >
                          <option value="Home">Home (Flat / House)</option>
                          <option value="Work">Office / Workplace</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          City
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                          style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', outline: 'none' }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Street Address, Building, Flat No.
                        </label>
                        <input
                          type="text"
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                          placeholder="e.g. #42, Green Glen Layout, Bellandur"
                          required
                          style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                          placeholder="560103"
                          maxLength={6}
                          required
                          style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                          State
                        </label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          required
                          style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', outline: 'none' }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                          style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="isDefault" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                          Set this as my default delivery address
                        </label>
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm)' }}>
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          style={{ background: '#F1F5F9', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses List Cards */}
                {loadingAddresses ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B', fontSize: '0.9rem' }}>
                    Loading saved addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div
                    style={{
                      background: 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      border: '1.5px dashed #CBD5E1'
                    }}
                  >
                    <MapPin size={32} style={{ color: '#94A3B8', margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      No Saved Addresses Yet
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                      Add your address to save time during checkout.
                    </p>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="btn-accent-blue"
                      style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-full)' }}
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        style={{
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          border: addr.is_default ? '2px solid var(--color-purple-primary)' : '1px solid #E2E8F0',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#F1F5F9', padding: '3px 8px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase', color: 'var(--color-purple-dark)' }}>
                              {addr.address_label || 'Home'}
                            </span>
                            {addr.is_default ? (
                              <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '2px 7px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                                Default
                              </span>
                            ) : null}
                          </div>

                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            {addr.address_line1}
                          </div>
                          {addr.address_line2 && (
                            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.25rem' }}>
                              {addr.address_line2}
                            </div>
                          )}
                          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            {addr.city}, {addr.state} - <strong>{addr.postal_code}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. ACCOUNT DETAILS TAB */}
            {activeTab === 'details' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Personal Details & Security
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
                    Update your contact details for delivery updates and order invoices
                  </p>
                </div>

                <div
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E2E8F0',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-sm)',
                    maxWidth: '600px'
                  }}
                >
                  {profileNotice && (
                    <div style={{ background: '#F0FDF4', color: '#15803D', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} /> {profileNotice}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Email Address (Account ID)
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: '0.92rem' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                        Primary email used for order confirmations and receipts.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                        Used by our delivery courier agent for dispatch notifications.
                      </span>
                    </div>

                    <div style={{ paddingTop: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="btn-primary"
                        style={{ padding: '0.8rem 1.75rem', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}
                      >
                        {profileSaving ? 'Saving Changes...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
