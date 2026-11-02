import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, User } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyWhiteMist from './components/WhyWhiteMist';
import ProductsShowcase from './components/ProductsShowcase';
import StainCalculator from './components/StainCalculator';
import SuperSaverBanner from './components/SuperSaverBanner';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';
import OrderSuccessModal from './components/OrderSuccessModal';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoadingScreen from './components/LoadingScreen';
import ServiceQuoteModal from './components/ServiceQuoteModal';
import CartPage from './components/CartPage';
import StainBeforeAfter from './components/StainBeforeAfter';
import BioEnzymeAnimation from './components/BioEnzymeAnimation';
import ShirtScrollAnimation from './components/ShirtScrollAnimation';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';
import { PRODUCTS, CATEGORIES } from './data/products';
import { api } from './services/api';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'products' | 'wishlist' | 'product-detail' | 'checkout' | 'profile'
  const [previousView, setPreviousView] = useState('home');

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('wm_token') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authNotice, setAuthNotice] = useState('');
  const [pendingCheckoutAfterAuth, setPendingCheckoutAfterAuth] = useState(false);
  const [pendingCartSummary, setPendingCartSummary] = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState('orders');

  const handleLoginSuccess = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('wm_user', JSON.stringify(userData));
    localStorage.setItem('wm_token', tokenStr);
    showToast(`Welcome back, ${userData.full_name || 'Member'}!`);
  };

  const handleRegisterSuccess = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('wm_user', JSON.stringify(userData));
    localStorage.setItem('wm_token', tokenStr);
    showToast(`Welcome to White Mist, ${userData.full_name || 'Member'}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPendingCheckoutAfterAuth(false);
    setPendingCartSummary(null);
    setAuthNotice('');
    localStorage.removeItem('wm_user');
    localStorage.removeItem('wm_token');
    if (activeView === 'profile' || activeView === 'checkout') {
      setActiveView('home');
    }
    showToast('You have been signed out.');
  };

  const handleOpenAuth = (mode = 'login', notice = '') => {
    setAuthNotice(notice || '');
    setPendingCheckoutAfterAuth(false);
    setPendingCartSummary(null);
    setAuthModalMode(mode);
    setPreviousView(activeView !== 'auth' ? activeView : 'home');
    setActiveView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = (tab = 'orders') => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setProfileInitialTab(tab);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('wm_user', JSON.stringify(updatedUser));
  };

  // Initialize Lenis smooth scroll across the entire application
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
      infinite: false,
      autoRaf: true,
      anchors: true,
    });

    window.lenis = lenis;

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };

    const handleLenisScroll = (e) => {
      setShowBackToTop(e.scroll > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const unbind = lenis.on('scroll', handleLenisScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unbind();
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // When active view changes, resize Lenis and smoothly reset to the top
  useEffect(() => {
    if (window.lenis) {
      window.lenis.resize();
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeView]);

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.3 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Live Database Products & Categories State
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);

  useEffect(() => {
    // Fetch live products & categories from MySQL database
    api.getProducts()
      .then(prods => {
        if (prods && prods.length > 0) setProductsList(prods);
      })
      .catch(err => console.warn('Could not load products from API:', err));

    api.getCategories()
      .then(cats => {
        if (cats && cats.length > 0) {
          setCategoriesList(cats.map(c => ({ id: c.slug, name: c.name, icon: c.icon || 'Layers' })));
        }
      })
      .catch(err => console.warn('Could not load categories from API:', err));
  }, []);

  // Cart Items State
  const [cartItems, setCartItems] = useState([
    {
      cartKey: "wm-blue-ocean-bot-2l",
      productId: "wm-blue-ocean",
      name: "White Mist Ocean Fresh",
      formatName: "2L Ergonomic Bottle",
      price: 349,
      mrp: 499,
      image: "/assets/images/bottle_blue.png",
      quantity: 1
    }
  ]);

  // Wishlist Items State
  const [wishlistItems, setWishlistItems] = useState([
    PRODUCTS[0], // Pre-save Ocean Fresh
    PRODUCTS[1]  // Pre-save Floral Bloom
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceModalTab, setServiceModalTab] = useState('quote');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartSummary, setCartSummary] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [flyingItem, setFlyingItem] = useState(null);

  const cartBadgeRef = useRef(null);

  const handleOpenServiceModal = (tab = 'quote') => {
    setServiceModalTab(tab);
    setIsServiceModalOpen(true);
  };

  // Total counts
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Toggle Wishlist item
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from Wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`❤️ Saved ${product.name} to Wishlist!`);
        return [...prev, product];
      }
    });
  };

  // Add Item to Cart with Flight Micro-Interaction
  const handleAddToCart = (product, format, event) => {
    const cartKey = `${product.id}-${format.id}`;

    if (event && cartBadgeRef.current) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      const badgeRect = cartBadgeRef.current.getBoundingClientRect();

      setFlyingItem({
        image: format.image,
        startX: btnRect.left + btnRect.width / 2,
        startY: btnRect.top + btnRect.height / 2,
        endX: badgeRect.left + badgeRect.width / 2,
        endY: badgeRect.top + badgeRect.height / 2
      });

      setTimeout(() => {
        setFlyingItem(null);
      }, 700);
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i => i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        cartKey,
        productId: product.id,
        name: product.name,
        formatName: format.name,
        price: format.price,
        mrp: format.mrp,
        image: format.image,
        quantity: 1
      }];
    });

    showToast(`Added ${product.name} (${format.name}) to cart!`);
  };

  // Add Super Saver Bundle to Cart
  const handleAddBundleToCart = (bundle, event) => {
    const cartKey = bundle.id;

    if (event && cartBadgeRef.current) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      const badgeRect = cartBadgeRef.current.getBoundingClientRect();
      setFlyingItem({
        image: bundle.image,
        startX: btnRect.left + btnRect.width / 2,
        startY: btnRect.top + btnRect.height / 2,
        endX: badgeRect.left + badgeRect.width / 2,
        endY: badgeRect.top + badgeRect.height / 2
      });
      setTimeout(() => setFlyingItem(null), 700);
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i => i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        cartKey,
        productId: bundle.id,
        name: bundle.title,
        formatName: "4kg Mega Saver Bundle",
        price: bundle.price,
        mrp: bundle.mrp,
        image: bundle.image,
        quantity: 1
      }];
    });

    showToast("Super Saver Bundle added to your cart!");
  };

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartKey);
      return;
    }
    setCartItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (cartKey) => {
    setCartItems(prev => prev.filter(i => i.cartKey !== cartKey));
    showToast("Item removed from cart");
  };

  // OPEN FULL PRODUCT DETAILS PAGE
  const handleOpenProductDetailPage = (product, format) => {
    setSelectedProduct(product);
    setSelectedFormat(format || product.formats[0]);
    setPreviousView(activeView);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute structured cart summary for checkout
  const computeCartSummary = (items, promo = null) => {
    const currentItems = items || [];
    const subtotal = currentItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const freeShippingThreshold = 499;
    const shippingCost = subtotal >= freeShippingThreshold || currentItems.length === 0 ? 0 : 49;
    const promoDiscount = promo ? promo.discount : 0;
    const finalTotal = Math.max(0, subtotal - promoDiscount + shippingCost);
    return {
      cartItems: currentItems,
      subtotal,
      promoDiscount,
      shippingCost,
      finalTotal,
      appliedPromo: promo?.code || promo || null
    };
  };

  const handleBuyNow = (product, format, qty = 1) => {
    const quantityToAdd = qty && qty > 0 ? Number(qty) : 1;
    const selectedFmt = format || (product.formats && product.formats[0]) || {
      id: 'standard',
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image
    };
    const cartKey = `${product.id}-${selectedFmt.id}`;

    // Add or update this item in the cart with the selected quantity
    let updatedCart;
    const existing = cartItems.find(i => i.cartKey === cartKey);
    if (existing) {
      updatedCart = cartItems.map(i => i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantityToAdd } : i);
    } else {
      updatedCart = [...cartItems, {
        cartKey,
        productId: product.id,
        name: product.name,
        formatName: selectedFmt.name,
        price: selectedFmt.price,
        mrp: selectedFmt.mrp,
        image: selectedFmt.image,
        quantity: quantityToAdd
      }];
    }
    setCartItems(updatedCart);

    const summary = computeCartSummary(updatedCart);

    // CHECK: whether the user is signed in or not
    if (!user) {
      // User is not signed in: direct to signin page to get signed in
      setPendingCartSummary(summary);
      setPendingCheckoutAfterAuth(true);
      setAuthNotice(`Please sign in or create an account to proceed with purchasing ${product.name} (${selectedFmt.name}).`);
      showToast('Please sign in to proceed with your purchase');
      setPreviousView(activeView !== 'auth' ? activeView : 'product-detail');
      setAuthModalMode('login');
      setActiveView('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // User is signed in: direct instant checkout
    setCartSummary(summary);
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Proceeding to checkout with ${product.name}!`);
  };

  const handleProceedToCheckout = (summary) => {
    setCartSummary(summary);
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    setOrderDetails(order);
    setCartItems([]);
    setActiveView('home');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Brand Animated Loading Screen */}
      {isLoading && (
        <LoadingScreen onFinishLoading={() => {
          setIsLoading(false);
          window.scrollTo(0, 0);
        }} />
      )}

      {/* Navbar (Hidden on Profile and Sign In / Sign Up pages) */}
      {activeView !== 'profile' && activeView !== 'auth' && (
        <Navbar 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onOpenCart={() => {
            setActiveView('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenServiceModal={handleOpenServiceModal}
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartBadgeRef={cartBadgeRef}
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenProfile={handleOpenProfile}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'home' && (
          <>
            <Hero 
              onAddToCart={handleAddToCart}
              onSelectProduct={handleOpenProductDetailPage}
            />
            <WhyWhiteMist />
            <StainBeforeAfter />
            <ShirtScrollAnimation />
            <ProductsShowcase 
              products={productsList}
              onAddToCart={handleAddToCart}
              onOpenModal={handleOpenProductDetailPage}
              searchQuery={searchQuery}
              onNavigateToAllProducts={() => {
                setActiveView('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <BioEnzymeAnimation />
            <StainCalculator onAddToCart={handleAddToCart} />
            <SuperSaverBanner onAddBundleToCart={handleAddBundleToCart} />
            <Testimonials />
          </>
        )}

        {activeView === 'products' && (
          <ProductsPage 
            products={productsList}
            categories={categoriesList}
            onAddToCart={handleAddToCart}
            onOpenModal={handleOpenProductDetailPage}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeView === 'wishlist' && (
          <ProfilePage 
            user={user || { full_name: 'Guest Member', email: 'Sign in to save items across devices' }}
            token={token}
            onLogout={handleLogout}
            onNavigateToProducts={() => {
              setActiveView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateUser={handleUpdateUser}
            initialTab="wishlist"
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'product-detail' && (
          <ProductDetailPage 
            product={selectedProduct}
            selectedFormat={selectedFormat}
            onBack={() => {
              setActiveView(previousView || 'products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'cart' && (
          <CartPage 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={handleProceedToCheckout}
            onNavigateToProducts={() => {
              setActiveView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPage 
            cartSummary={cartSummary}
            onBackToCart={() => {
              setActiveView('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderSuccess={handleOrderSuccess}
            user={user}
            token={token}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeView === 'profile' && (
          user ? (
            <ProfilePage
              user={user}
              token={token}
              onLogout={handleLogout}
              onNavigateToProducts={() => {
                setActiveView('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onUpdateUser={handleUpdateUser}
              initialTab={profileInitialTab}
              wishlistItems={wishlistItems}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
          ) : (
            profileInitialTab === 'wishlist' ? (
              <ProfilePage
                user={{ full_name: 'Guest Member', email: 'Sign in to sync your wishlist' }}
                token={null}
                onLogout={() => {}}
                onNavigateToProducts={() => {
                  setActiveView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateHome={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUpdateUser={() => {}}
                initialTab="wishlist"
                wishlistItems={wishlistItems}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div style={{ padding: '4rem 1rem 5rem', textAlign: 'center', background: '#FAFCFF', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '480px', background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F3EBFD', color: 'var(--color-purple-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <User size={30} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.5rem' }}>
                    Account Profile
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                    Please log in or create an account to view your order history, delivery addresses, and personal details.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)' }}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setActiveView('home')}
                      style={{ background: '#F1F5F9', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}

        {activeView === 'auth' && (
          <AuthPage
            initialMode={authModalMode}
            authNotice={authNotice}
            onLoginSuccess={(userData, tokenStr) => {
              handleLoginSuccess(userData, tokenStr);
              if (pendingCheckoutAfterAuth) {
                const summaryToUse = pendingCartSummary || computeCartSummary(cartItems);
                setPendingCheckoutAfterAuth(false);
                setPendingCartSummary(null);
                setAuthNotice('');
                setCartSummary(summaryToUse);
                setActiveView('checkout');
                showToast(`Welcome back, ${userData.full_name || 'Member'}! Continuing to checkout...`);
              } else if (previousView && previousView !== 'auth') {
                setActiveView(previousView);
              } else {
                setActiveView('profile');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRegisterSuccess={(userData, tokenStr) => {
              handleRegisterSuccess(userData, tokenStr);
              if (pendingCheckoutAfterAuth) {
                const summaryToUse = pendingCartSummary || computeCartSummary(cartItems);
                setPendingCheckoutAfterAuth(false);
                setPendingCartSummary(null);
                setAuthNotice('');
                setCartSummary(summaryToUse);
                setActiveView('checkout');
                showToast(`Welcome to White Mist, ${userData.full_name || 'Member'}! Continuing to checkout...`);
              } else if (previousView && previousView !== 'auth') {
                setActiveView(previousView);
              } else {
                setActiveView('profile');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setPendingCheckoutAfterAuth(false);
              setPendingCartSummary(null);
              setAuthNotice('');
              setActiveView(previousView && previousView !== 'auth' ? previousView : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      {activeView !== 'auth' && <Footer />}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onViewFullCart={() => {
          setActiveView('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Service, Quote & Warranty Modal */}
      <ServiceQuoteModal 
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        activeTab={serviceModalTab}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Order Success Celebration Modal */}
      {orderDetails && (
        <OrderSuccessModal 
          orderDetails={orderDetails}
          onContinueShopping={() => {
            setOrderDetails(null);
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Flying Item Micro-Interaction Animation Component */}
      {flyingItem && (
        <div 
          className="flying-item"
          style={{
            left: `${flyingItem.startX}px`,
            top: `${flyingItem.startY}px`,
            width: '45px',
            height: '45px',
            transform: `translate(${flyingItem.endX - flyingItem.startX}px, ${flyingItem.endY - flyingItem.startY}px) scale(0.2)`,
            opacity: 0.1
          }}
        >
          <img src={flyingItem.image} alt="Flying Item" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to Top"
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-purple-primary) 0%, #3F1B85 100%)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 25px rgba(63, 27, 133, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 900,
          opacity: showBackToTop ? 1 : 0,
          visibility: showBackToTop ? 'visible' : 'hidden',
          transform: showBackToTop ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <ArrowUp size={22} strokeWidth={2.5} />
      </button>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: showBackToTop ? '86px' : '28px',
          right: '28px',
          background: 'var(--color-purple-dark)',
          color: 'white',
          padding: '0.85rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          zIndex: 9999,
          fontSize: '0.9rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'bounceIn 0.3s ease',
          transition: 'bottom 0.3s ease'
        }}>
          ✨ {toastMessage}
        </div>
      )}

    </div>
  );
}
