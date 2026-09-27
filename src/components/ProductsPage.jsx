import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Filter, Sparkles, SlidersHorizontal, ArrowUpDown, Layers, Droplets, Leaf, HeartHandshake, Zap, Package } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function ProductsPage({ onAddToCart, onOpenModal, wishlistItems, onToggleWishlist, searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFormatMap, setSelectedFormatMap] = useState({});

  const handleFormatSelect = (productId, formatIdx) => {
    setSelectedFormatMap(prev => ({ ...prev, [productId]: formatIdx }));
  };

  // Map Category Icons
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Droplets': return <Droplets size={18} />;
      case 'Leaf': return <Leaf size={18} />;
      case 'HeartHandshake': return <HeartHandshake size={18} />;
      case 'Zap': return <Zap size={18} />;
      case 'Package': return <Package size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedColor !== 'all' && product.color !== selectedColor) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(q) || 
             product.description.toLowerCase().includes(q) ||
             product.categoryName.toLowerCase().includes(q);
    }

    return true;
  }).sort((a, b) => {
    const aPrice = a.formats[0].price;
    const bPrice = b.formats[0].price;

    if (sortBy === 'price-low') return aPrice - bPrice;
    if (sortBy === 'price-high') return bPrice - aPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return parseInt(b.formats[0].discount) - parseInt(a.formats[0].discount);
    return 0;
  });

  return (
    <div style={{ padding: '7.5rem 0 5rem 0', background: '#FAFCFF', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Page Banner & Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3F1B85 0%, #270D5B 50%, #0084FF 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          color: 'white',
          marginBottom: '2.5rem',
          boxShadow: '0 15px 35px rgba(39, 13, 91, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              COMPLETE CATALOGUE
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Explore All Detergents & Laundry Care
            </h1>
            <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '600px' }}>
              Find the perfect liquid detergent, eco refill pouch, fabric conditioner, or oxy stain booster for your home.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>Showing:</span>
            <strong style={{ color: 'var(--color-purple-dark)', fontSize: '1.1rem' }}>{filteredProducts.length} Products</strong>
          </div>
        </div>

        {/* 2-Column Layout: Sticky Category Sidebar on Left + Products Grid on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }} className="catalog-sidebar-grid">

          {/* Left Column: STICKY Category Buttons Sidebar */}
          <div style={{
            position: 'sticky',
            top: '100px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple-dark)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
              <Layers size={20} />
              <span>Product Categories</span>
            </div>

            {/* Vertical Category Button List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? 'none' : '1px solid transparent',
                      background: isSelected ? 'linear-gradient(135deg, #3F1B85 0%, #6A3BC8 100%)' : '#FAFCFF',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      fontWeight: isSelected ? '800' : '600',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      boxShadow: isSelected ? '0 4px 14px rgba(63, 27, 133, 0.25)' : 'none'
                    }}
                  >
                    <span style={{ color: isSelected ? 'white' : 'var(--color-purple-primary)' }}>
                      {getCategoryIcon(cat.icon)}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Fragrance Filter Box in Sidebar */}
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                Fragrance Family:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { id: 'all', label: 'All Fragrances' },
                  { id: 'blue', label: 'Ocean Fresh (Blue)' },
                  { id: 'pink', label: 'Floral Bloom (Pink)' },
                  { id: 'yellow', label: 'Citrus Sunshine (Yellow)' }
                ].map(col => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColor(col.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedColor === col.id ? '2px solid var(--color-purple-primary)' : '1px solid #CBD5E1',
                      background: selectedColor === col.id ? '#F3EBFD' : 'white',
                      color: selectedColor === col.id ? 'var(--color-purple-dark)' : '#64748B',
                      fontWeight: '700',
                      fontSize: '0.825rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Products Grid & Sort Header */}
          <div>
            
            {/* Top Sort Header Bar */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              border: '1px solid #E2E8F0',
              marginBottom: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredProducts.length}</strong> items in <strong>{CATEGORIES.find(c => c.id === selectedCategory)?.name}</strong>
              </div>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No products found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try adjusting your search keywords or category filters.</p>
                <button onClick={() => { setSelectedCategory('all'); setSelectedColor('all'); setSearchQuery(''); }} className="btn-primary">Reset Filters</button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem'
              }} className="catalog-products-grid">
                {filteredProducts.map(product => {
                  const formatIdx = selectedFormatMap[product.id] || 0;
                  const currentFormat = product.formats[formatIdx];
                  const isWishlisted = wishlistItems.some(item => item.id === product.id);

                  return (
                    <div key={product.id} className="product-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Top Badges & Wishlist Heart Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge-primary" style={{ background: product.accentColor }}>
                          {product.badge}
                        </span>
                        
                        {/* Wishlist Toggle Button */}
                        <button
                          onClick={() => onToggleWishlist(product)}
                          style={{
                            background: 'white',
                            border: '1px solid #E2E8F0',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isWishlisted ? '#F01262' : '#94A3B8',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'var(--transition)'
                          }}
                          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart size={16} fill={isWishlisted ? "#F01262" : "none"} />
                        </button>
                      </div>

                      {/* Product Image Stage (Clicking opens Full PDP Page!) */}
                      <div 
                        onClick={() => onOpenModal(product, currentFormat)}
                        style={{
                          height: '220px',
                          background: product.bgGradient,
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          marginBottom: '1rem'
                        }}
                      >
                        <img 
                          src={currentFormat.image} 
                          alt={product.name}
                          className="product-img"
                          style={{
                            maxHeight: '180px',
                            maxWidth: '85%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.12))'
                          }}
                        />
                        
                        {/* View Full Page Icon Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'white',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          color: 'var(--color-purple-primary)',
                          boxShadow: 'var(--shadow-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Eye size={14} /> Full Details
                        </div>
                      </div>

                      {/* Rating & Category */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={14} fill="#FFB800" stroke="none" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>{product.rating}</span>
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
                        </div>
                        <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-purple-primary)', background: '#F3EBFD', padding: '2px 8px', borderRadius: '4px' }}>
                          {product.categoryName}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 
                        onClick={() => onOpenModal(product, currentFormat)}
                        style={{ fontSize: '1.15rem', fontWeight: '800', cursor: 'pointer', color: 'var(--text-main)', marginBottom: '0.2rem', lineHeight: 1.25 }}
                      >
                        {product.name}
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem', flexGrow: 1 }}>
                        {product.tagline}
                      </p>

                      {/* Format Selector Pills */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {product.formats.map((fmt, idx) => (
                            <button
                              key={fmt.id}
                              onClick={() => handleFormatSelect(product.id, idx)}
                              style={{
                                padding: '0.3rem 0.55rem',
                                borderRadius: 'var(--radius-sm)',
                                border: formatIdx === idx ? `2px solid ${product.accentColor}` : '1px solid #E2E8F0',
                                background: formatIdx === idx ? '#F8FAFC' : 'white',
                                color: formatIdx === idx ? 'var(--text-main)' : '#64748B',
                                fontSize: '0.725rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {fmt.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price & Add to Cart */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F1F5F9'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                              ₹{currentFormat.price}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                              ₹{currentFormat.mrp}
                            </span>
                          </div>
                          <span className="badge-discount">{currentFormat.discount}</span>
                        </div>

                        <button
                          onClick={(e) => onAddToCart(product, currentFormat, e)}
                          className="btn-primary"
                          style={{
                            padding: '0.55rem 1rem',
                            fontSize: '0.825rem'
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
