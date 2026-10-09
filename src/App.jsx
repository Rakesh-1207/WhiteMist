import React, { useState, useRef } from 'react';
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
import WishlistPage from './components/WishlistPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoadingScreen from './components/LoadingScreen';
import ServiceQuoteModal from './components/ServiceQuoteModal';
import CartPage from './components/CartPage';
import StainBeforeAfter from './components/StainBeforeAfter';
import BioEnzymeAnimation from './components/BioEnzymeAnimation';
import FragranceScentLock from './components/FragranceScentLock';
import { PRODUCTS } from './data/products';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'products' | 'wishlist' | 'product-detail' | 'checkout'
  const [previousView, setPreviousView] = useState('home');

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

  const handleBuyNow = (product, format, qty) => {
    handleAddToCart(product, format);
    setIsCartOpen(true);
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
        <LoadingScreen onFinishLoading={() => setIsLoading(false)} />
      )}

      {/* Navbar */}
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
      />

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
            <ProductsShowcase 
              onAddToCart={handleAddToCart}
              onOpenModal={handleOpenProductDetailPage}
              searchQuery={searchQuery}
              onNavigateToAllProducts={() => {
                setActiveView('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <BioEnzymeAnimation />
            <FragranceScentLock />
            <StainCalculator onAddToCart={handleAddToCart} />
            <SuperSaverBanner onAddBundleToCart={handleAddBundleToCart} />
            <Testimonials />
          </>
        )}

        {activeView === 'products' && (
          <ProductsPage 
            onAddToCart={handleAddToCart}
            onOpenModal={handleOpenProductDetailPage}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistPage 
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigateToProducts={() => setActiveView('products')}
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
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

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

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
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
          animation: 'bounceIn 0.3s ease'
        }}>
          ✨ {toastMessage}
        </div>
      )}

    </div>
  );
}
