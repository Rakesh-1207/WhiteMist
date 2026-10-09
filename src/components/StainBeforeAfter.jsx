import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Sliders, Droplets, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

export default function StainBeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStain, setActiveStain] = useState('grease');
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const stains = {
    grease: {
      name: "Tough Cooking Oil & Kadhai Grease",
      stainColor: "rgba(180, 83, 9, 0.75)",
      spots: [
        { top: '25%', left: '30%', size: '120px', rotate: '15deg' },
        { top: '55%', left: '45%', size: '160px', rotate: '-25deg' },
        { top: '35%', left: '60%', size: '90px', rotate: '40deg' }
      ]
    },
    mud: {
      name: "Stubborn Mud & Grass Stains",
      stainColor: "rgba(120, 53, 15, 0.8)",
      spots: [
        { top: '20%', left: '25%', size: '140px', rotate: '-10deg' },
        { top: '50%', left: '35%', size: '110px', rotate: '30deg' },
        { top: '40%', left: '65%', size: '150px', rotate: '-15deg' }
      ]
    },
    coffee: {
      name: "Dark Coffee, Tea & Turmeric",
      stainColor: "rgba(146, 64, 14, 0.75)",
      spots: [
        { top: '30%', left: '35%', size: '130px', rotate: '5deg' },
        { top: '45%', left: '55%', size: '140px', rotate: '-35deg' }
      ]
    },
    sweat: {
      name: "Yellow Collar Sweat & Odor",
      stainColor: "rgba(202, 138, 4, 0.7)",
      spots: [
        { top: '15%', left: '20%', size: '180px', rotate: '0deg' },
        { top: '60%', left: '50%', size: '130px', rotate: '20deg' }
      ]
    }
  };

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleAutoClean = () => {
    setIsAnimating(true);
    setSliderPosition(0);
    let pos = 0;
    const interval = setInterval(() => {
      pos += 2;
      setSliderPosition(pos);
      if (pos >= 100) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 20);
  };

  const currentStain = stains[activeStain];

  return (
    <section style={{ padding: '5rem 0', background: 'linear-gradient(180deg, #FAFCFF 0%, #F1F5F9 100%)', position: 'relative', overflow: 'hidden' }}>
      
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#E6F3FF', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', color: '#0084FF', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Sparkles size={16} /> INTERACTIVE STAIN REMOVAL DEMO
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.75rem' }}>
            Drag to Reveal 10x Bio-Clean Magic
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Slide across the fabric below to see how White Mist’s active bio-enzymes penetrate deep fibers, dissolving tough stains instantly without harming fabric color.
          </p>
        </div>

        {/* Stain Selector Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {Object.keys(stains).map((key) => (
            <button
              key={key}
              onClick={() => { setActiveStain(key); setSliderPosition(50); }}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                border: activeStain === key ? '2px solid var(--color-purple-primary)' : '1px solid #CBD5E1',
                background: activeStain === key ? 'var(--color-purple-primary)' : 'white',
                color: activeStain === key ? 'white' : '#475569',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeStain === key ? '0 8px 16px rgba(63, 27, 133, 0.25)' : 'none'
              }}
            >
              {stains[key].name}
            </button>
          ))}
        </div>

        {/* Before / After Interactive Slider Container */}
        <div 
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            height: '420px',
            margin: '0 auto',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            userSelect: 'none',
            cursor: 'ew-resize',
            border: '4px solid white'
          }}
        >
          
          {/* AFTER Image Layer (Clean Pure Fabric) */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url('/assets/images/fabric_bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '3rem'
          }}>
            <div style={{
              background: 'rgba(22, 163, 74, 0.9)',
              color: 'white',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)'
            }}>
              <CheckCircle2 size={18} /> AFTER: 100% Clean & Fresh
            </div>
          </div>

          {/* BEFORE Image Layer (Stained Fabric clipped by slider) */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: `${sliderPosition}%`,
            overflow: 'hidden',
            zIndex: 2,
            borderRight: '3px solid white',
            boxShadow: '5px 0 20px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '900px',
              height: '100%',
              backgroundImage: `url('/assets/images/fabric_bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.92) contrast(1.05)'
            }}>
              {/* Render Stains on Before Side */}
              {currentStain.spots.map((spot, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: spot.top,
                    left: spot.left,
                    width: spot.size,
                    height: spot.size,
                    borderRadius: '50%',
                    background: currentStain.stainColor,
                    filter: 'blur(16px)',
                    transform: `rotate(${spot.rotate}) scale(1.1)`,
                    opacity: 0.85
                  }}
                />
              ))}

              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                background: 'rgba(220, 38, 38, 0.9)',
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
              }}>
                ❌ BEFORE: Tough {currentStain.name}
              </div>
            </div>
          </div>

          {/* Center Slider Divider Bar & Handle */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${sliderPosition}%`,
            width: '4px',
            background: 'white',
            zIndex: 3,
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-purple-dark)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(63, 27, 133, 0.5)',
              border: '3px solid white',
              cursor: 'ew-resize'
            }}>
              <Sliders size={20} />
            </div>
          </div>

        </div>

        {/* Bottom CTA Controls & Metrics */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleAutoClean}
            disabled={isAnimating}
            className="btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <RefreshCw size={18} className={isAnimating ? 'spin-icon' : ''} />
            <span>Auto Wash Animation</span>
          </button>

          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '700' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A' }}>
              <Zap size={18} /> 10x Fast Stain Dissolve
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0084FF' }}>
              <Droplets size={18} /> Color Guard Shield
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
