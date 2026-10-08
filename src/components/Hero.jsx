import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Droplet, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onAddToCart, onSelectProduct }) {
  const [selectedVariant, setSelectedVariant] = useState('blue');
  const [poppedBubbles, setPoppedBubbles] = useState({});

  const handlePopBubble = (id) => {
    setPoppedBubbles(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setPoppedBubbles(prev => ({ ...prev, [id]: false }));
    }, 3000);
  };

  const heroVariants = {
    blue: {
      id: "wm-blue-ocean",
      title: "Ocean Fresh",
      subtitle: "Deep Clean & 48hr Sea Breeze",
      bottleImg: "/assets/images/bottle_blue.png",
      pouchImg: "/assets/images/pouch_blue.png",
      glowColor: "rgba(0, 132, 255, 0.25)",
      bgGradient: "radial-gradient(circle at 70% 40%, #E6F3FF 0%, #FAFCFF 70%)",
      badgeColor: "#0084FF",
      shineClass: "shine-text-blue"
    },
    pink: {
      id: "wm-pink-floral",
      title: "Floral Bloom",
      subtitle: "Rose Elegance & Soft Fabric Touch",
      bottleImg: "/assets/images/bottle_pink.png",
      pouchImg: "/assets/images/pouch_pink.png",
      glowColor: "rgba(240, 18, 98, 0.25)",
      bgGradient: "radial-gradient(circle at 70% 40%, #FFEBF2 0%, #FAFCFF 70%)",
      badgeColor: "#F01262",
      shineClass: "shine-text-pink"
    },
    yellow: {
      id: "wm-yellow-citrus",
      title: "Citrus Sunshine",
      subtitle: "10x Tough Oil & Stain Destroyer",
      bottleImg: "/assets/images/bottle_yellow.png",
      pouchImg: "/assets/images/pouch_yellow.png",
      glowColor: "rgba(255, 184, 0, 0.3)",
      bgGradient: "radial-gradient(circle at 70% 40%, #FFFDE6 0%, #FAFCFF 70%)",
      badgeColor: "#D97706",
      shineClass: "shine-text-yellow"
    }
  };

  const current = heroVariants[selectedVariant];

  // Pure CSS 3D Soap Bubbles configurations
  const bubbleList = [
    { id: 'b1', top: '8%', left: '3%', size: '95px', animation: 'bubbleDrift1 7s ease-in-out infinite', delay: '0s' },
    { id: 'b2', top: '45%', left: '1.5%', size: '60px', animation: 'bubbleDrift2 8.5s ease-in-out infinite', delay: '1s' },
    { id: 'b3', top: '18%', right: '44%', size: '120px', animation: 'bubbleDrift3 9.5s ease-in-out infinite', delay: '0.4s' },
    { id: 'b4', bottom: '10%', left: '35%', size: '80px', animation: 'bubbleDrift1 6.5s ease-in-out infinite', delay: '1.6s' },
    { id: 'b5', top: '12%', right: '7%', size: '105px', animation: 'bubbleDrift2 8s ease-in-out infinite', delay: '2.1s' },
    { id: 'b6', bottom: '15%', right: '4%', size: '130px', animation: 'bubbleDrift3 7.8s ease-in-out infinite', delay: '0.7s' },
    { id: 'b7', top: '52%', right: '24%', size: '50px', animation: 'bubbleDrift1 6s ease-in-out infinite', delay: '1.3s' },
    { id: 'b8', top: '75%', left: '12%', size: '70px', animation: 'bubbleDrift2 9s ease-in-out infinite', delay: '2.5s' },
    { id: 'b9', top: '30%', right: '12%', size: '65px', animation: 'bubbleDrift3 7.2s ease-in-out infinite', delay: '1.8s' },
    { id: 'b10', top: '82%', right: '35%', size: '85px', animation: 'bubbleDrift1 8.2s ease-in-out infinite', delay: '0.9s' }
  ];

  return (
    <section className="full-screen-hero" style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Continuous Wave Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <source src="/assets/video/visible_gentle_continuous_wave_10s.mp4" type="video/mp4" />
      </video>

      {/* Subtle Overlay to ensure high contrast */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(240, 248, 255, 0.15) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Pure CSS 3D Glossy Soap Bubbles Stream */}
      {bubbleList.map(b => (
        !poppedBubbles[b.id] && (
          <div
            key={b.id}
            className="pure-css-bubble"
            onClick={() => handlePopBubble(b.id)}
            title="Click to pop bubble!"
            style={{
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              animation: b.animation,
              animationDelay: b.delay
            }}
          />
        )
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '2.5rem',
          alignItems: 'center'
        }} className="hero-grid">

          {/* Left Text & CTA Content */}
          <div>
            
            <h1 style={{
              fontSize: '3.75rem',
              fontWeight: '800',
              color: 'var(--color-purple-dark)',
              marginBottom: '1.25rem',
              lineHeight: 1.08
            }}>
              Pure Cleanliness, <br />
              <span className={current.shineClass}>
                Infinite Freshness.
              </span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
              maxWidth: '540px',
              fontStyle: 'italic'
            }} className="hero-description-text">
              Meridian <strong>White Mist Liquid Detergent</strong> dissolves 10x tough stains instantly while infusing garments with 48-hour micro-capsule fragrance. Perfect for both <strong>Front Load & Top Load</strong> machines.
            </p>

            {/* Feature Checkmarks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1.75rem',
              maxWidth: '520px'
            }} className="hero-checkmarks-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}>
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>Front & Top Load Safe</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}>
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>10x Bio-Stain Removal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}>
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>48hr Scent Lock</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}>
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>Eco Spout Pouch Refills</span>
              </div>
            </div>

            {/* Interactive Hero Variant Selector Switches */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Select Fragrance Variant:
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }} className="hero-variant-switcher">
                <button
                  onClick={() => setSelectedVariant('blue')}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedVariant === 'blue' ? '2px solid #0084FF' : '1px solid #CBD5E1',
                    background: selectedVariant === 'blue' ? '#E6F3FF' : 'white',
                    color: selectedVariant === 'blue' ? '#0084FF' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0084FF', display: 'inline-block', flexShrink: 0 }}></span>
                  <span className="full-text">Blue Ocean Fresh</span>
                  <span className="short-text">Ocean Blue</span>
                </button>

                <button
                  onClick={() => setSelectedVariant('pink')}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedVariant === 'pink' ? '2px solid #F01262' : '1px solid #CBD5E1',
                    background: selectedVariant === 'pink' ? '#FFEBF2' : 'white',
                    color: selectedVariant === 'pink' ? '#F01262' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F01262', display: 'inline-block', flexShrink: 0 }}></span>
                  <span className="full-text">Pink Floral Bloom</span>
                  <span className="short-text">Floral Pink</span>
                </button>

                <button
                  onClick={() => setSelectedVariant('yellow')}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedVariant === 'yellow' ? '2px solid #D97706' : '1px solid #CBD5E1',
                    background: selectedVariant === 'yellow' ? '#FFFDE6' : 'white',
                    color: selectedVariant === 'yellow' ? '#D97706' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFB800', display: 'inline-block', flexShrink: 0 }}></span>
                  <span className="full-text">Yellow Citrus</span>
                  <span className="short-text">Citrus Yellow</span>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }} className="hero-cta-group">
              <a 
                href="#products" 
                className="btn-primary" 
                style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}
              >
                <span>Shop White Mist</span>
                <ArrowRight size={18} />
              </a>

              <a 
                href="#stain-calculator" 
                className="btn-secondary" 
                style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}
              >
                <span>Calculate Dose</span>
              </a>
            </div>
          </div>

          {/* Right Floating Product Hero Visualizer */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Glowing Backdrop Aura */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: current.glowColor,
              filter: 'blur(50px)',
              zIndex: 1
            }} />

            {/* Floating Hero Bottle Image */}
            <div style={{ position: 'relative', zIndex: 2 }} className="animate-float">
              <img 
                src={current.bottleImg} 
                alt={`White Mist ${current.title}`}
                style={{
                  maxHeight: '440px',
                  width: 'auto',
                  filter: 'drop-shadow(0 20px 30px rgba(39, 13, 91, 0.18))',
                  transition: 'all 0.5s ease'
                }}
              />
            </div>

            {/* Floating Pouch Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              zIndex: 3,
              animation: 'floatSlow 5s ease-in-out infinite'
            }}>
              <img 
                src={current.pouchImg} 
                alt="White Mist Refill Pouch"
                style={{
                  maxHeight: '220px',
                  filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))'
                }}
              />
            </div>

            {/* Floating Super Saver Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 4,
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 1rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: current.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Super Saver</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>Save up to 39%</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
