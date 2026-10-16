import React, { useState, useRef, useEffect, useMemo } from 'react';

export default function ShirtScrollAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Butter-Smooth GPU-Synchronized Pinned Scroll Progress with RAF Throttling
  useEffect(() => {
    let rafId = null;
    let lastProgress = -1;

    const computeProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollTrack = rect.height - windowHeight;
      if (totalScrollTrack <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(100, (scrolled / totalScrollTrack) * 100));

      // Skip microscopic changes to eliminate unnecessary React re-renders on mobile
      if (Math.abs(rawProgress - lastProgress) >= 0.15) {
        lastProgress = rawProgress;
        setScrollProgress(Math.round(rawProgress * 10) / 10);
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(computeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    computeProgress();

    let unbindLenis = null;
    if (window.lenis && typeof window.lenis.on === 'function') {
      unbindLenis = window.lenis.on('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unbindLenis) unbindLenis();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Memoized Soft Pearlescent Micro-Foam (Zero re-calculations during scroll)
  const bubbles = useMemo(() => {
    const bubbleCount = isMobile ? 18 : 75;
    return Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      size: Math.floor((i % 5) * (isMobile ? 2.5 : 4)) + (isMobile ? 12 : 16),
      left: `${(i * (100 / bubbleCount)) + (Math.sin(i * 1.5) * 1.5)}%`,
      offsetY: (Math.sin(i * 1.2) * (isMobile ? 14 : 32)) - (isMobile ? 7 : 16),
      opacity: 0.65 + ((i % 4) * 0.08),
      animDuration: (2.5 + (i % 4) * 0.7).toFixed(1),
      animDelay: ((i % 7) * 0.2).toFixed(1)
    }));
  }, [isMobile]);

  const flyingBubbles = useMemo(() => {
    const flyingCount = isMobile ? 6 : 30;
    return Array.from({ length: flyingCount }).map((_, i) => ({
      id: i,
      size: Math.floor((i % 4) * (isMobile ? 2 : 3)) + (isMobile ? 10 : 12),
      left: `${(i * (100 / flyingCount)) + (Math.sin(i * 2.3) * 4.5)}%`,
      animDuration: (2.4 + (i % 6) * 0.4).toFixed(1),
      animDelay: ((i % 9) * 0.3).toFixed(1),
      animName: i % 3 === 0 ? 'bubbleFlyUpLeft' : i % 3 === 1 ? 'bubbleFlyUpRight' : 'bubbleFlyUp'
    }));
  }, [isMobile]);

  const shirtFrameHeight = isMobile ? 420 : 780;

  return (
    <section 
      ref={sectionRef}
      className="shirt-scroll-section"
      style={{ 
        position: 'relative',
        height: isMobile ? '200vh' : '220vh',
        background: 'linear-gradient(180deg, #FAFCFF 0%, #F1F5F9 50%, #E2E8F0 100%)'
      }}
    >
      {/* Inline Keyframes & Media Queries for Side Logos & Flying Bubbles */}
      <style>{`
        @keyframes gentleBubbleFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }

        @keyframes bubbleFlyUp {
          0% { transform: translateY(0px) translateX(0px) scale(0.6); opacity: 0; }
          20% { opacity: 0.9; }
          60% { transform: translateY(-55px) translateX(12px) scale(1.05); opacity: 0.85; }
          100% { transform: translateY(-115px) translateX(-8px) scale(0.4); opacity: 0; }
        }

        @keyframes bubbleFlyUpLeft {
          0% { transform: translateY(0px) translateX(0px) scale(0.7); opacity: 0; }
          25% { opacity: 0.95; }
          65% { transform: translateY(-65px) translateX(-20px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(-130px) translateX(-35px) scale(0.35); opacity: 0; }
        }

        @keyframes bubbleFlyUpRight {
          0% { transform: translateY(0px) translateX(0px) scale(0.65); opacity: 0; }
          25% { opacity: 0.9; }
          65% { transform: translateY(-60px) translateX(18px) scale(1.08); opacity: 0.85; }
          100% { transform: translateY(-120px) translateX(30px) scale(0.4); opacity: 0; }
        }

        @media (max-width: 1500px) {
          .side-logo-left {
            left: -240px !important;
            top: 82% !important;
            transform: translateY(-50%) rotate(-40deg) scale(0.85) !important;
          }
          .side-logo-right {
            right: -240px !important;
            top: 18% !important;
            transform: translateY(-50%) rotate(-40deg) scale(0.85) !important;
          }
        }
        @media (max-width: 1100px) {
          .side-logo-left, .side-logo-right {
            display: none !important;
          }
        }
      `}</style>

      {/* INNER STICKY VIEWPORT (Pins on screen while scrolling animation plays) */}
      <div 
        className="shirt-scroll-sticky"
        style={{
          position: 'sticky',
          top: 0,
          height: isMobile ? '100dvh' : '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >

        {/* LEFT SIDE HUGE WHITE MIST BRAND LOGO (Tilted 40° Anti-Clockwise, moved downward more, ~50% hidden behind left edge) */}
        <div 
          className="side-logo-left"
          style={{
            position: 'absolute',
            left: '-270px',
            top: '82%',
            transform: 'translateY(-50%) rotate(-40deg)',
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            opacity: 0.95
          }}
        >
          <img 
            src="/assets/images/logo.png" 
            alt="White Mist Brand Logo Left" 
            style={{
              height: '540px',
              maxWidth: '650px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 60px rgba(63, 27, 133, 0.25))'
            }}
          />
        </div>

        {/* RIGHT SIDE HUGE WHITE MIST BRAND LOGO (Tilted 40° Anti-Clockwise, moved further upward, ~50% hidden behind right edge) */}
        <div 
          className="side-logo-right"
          style={{
            position: 'absolute',
            right: '-270px',
            top: '18%',
            transform: 'translateY(-50%) rotate(-40deg)',
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            opacity: 0.95
          }}
        >
          <img 
            src="/assets/images/logo.png" 
            alt="White Mist Brand Logo Right" 
            style={{
              height: '540px',
              maxWidth: '650px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 60px rgba(63, 27, 133, 0.25))'
            }}
          />
        </div>

        {/* CENTER SHIRT ANIMATION CONTAINER */}
        <div 
          className="shirt-scroll-frame"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '850px',
            height: `${shirtFrameHeight}px`,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >

          {/* STAINED SHIRT LAYER (GPU Accelerated Inset Clipping) */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 0 ${scrollProgress}% 0)`,
              WebkitClipPath: `inset(0 0 ${scrollProgress}% 0)`,
              willChange: 'clip-path',
              transform: 'translateZ(0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: scrollProgress >= 98 ? 0 : 1,
              pointerEvents: 'none'
            }}
          >
            <img 
              src="/assets/images/shirt_stained_before.png" 
              alt="Stained Shirt"
              loading="eager"
              style={{
                width: '100%',
                height: `${shirtFrameHeight}px`,
                objectFit: 'contain',
                filter: isMobile ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' : 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                willChange: 'transform'
              }}
            />
          </div>

          {/* CLEAN SHIRT LAYER (GPU Accelerated Inset Clipping) */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(${100 - scrollProgress}% 0 0 0)`,
              WebkitClipPath: `inset(${100 - scrollProgress}% 0 0 0)`,
              willChange: 'clip-path',
              transform: 'translateZ(0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <img 
              src="/assets/images/shirt_clean_after.png" 
              alt="Clean Shirt"
              loading="eager"
              style={{
                width: '100%',
                height: `${shirtFrameHeight}px`,
                objectFit: 'contain',
                filter: isMobile ? 'drop-shadow(0 10px 20px rgba(56, 189, 248, 0.15))' : 'drop-shadow(0 25px 50px rgba(56, 189, 248, 0.2))',
                willChange: 'transform'
              }}
            />
          </div>

          {/* HIGH-DENSITY SOFT REALISTIC SOAP BUBBLE WAVE (Appears strictly on shirt image, disappears as soon as it leaves shirt) */}
          {(() => {
            const startShirt = 12; // Bottom hem of shirt image
            const endShirt = 86;   // Top collar of shirt image
            const fadeZone = 5;    // Quick fade right at the edge of the shirt fabric

            if (scrollProgress < startShirt || scrollProgress > endShirt) return null;

            let opacity = 1;
            if (scrollProgress < startShirt + fadeZone) {
              opacity = (scrollProgress - startShirt) / fadeZone;
            } else if (scrollProgress > endShirt - fadeZone) {
              opacity = (endShirt - scrollProgress) / fadeZone;
            }

            return (
              <div style={{
                position: 'absolute',
                left: isMobile ? '6%' : '12%',
                right: isMobile ? '6%' : '12%',
                bottom: `calc(${scrollProgress}% - ${isMobile ? 20 : 28}px)`,
                height: isMobile ? '45px' : '65px',
                pointerEvents: 'none',
                zIndex: 10,
                opacity: Math.max(0, Math.min(1, opacity)),
                transition: 'opacity 0.1s ease',
                willChange: 'bottom, opacity',
                transform: 'translateZ(0)'
              }}>
                {/* Soft White Cloud Shade & Mist Mask Overlay */}
                <div style={{
                  position: 'absolute',
                  left: '-5%', right: '-5%', top: isMobile ? '-14px' : '-25px',
                  height: isMobile ? '50px' : '75px',
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.85) 50%, rgba(255,255,255,0.3) 75%, transparent 100%)',
                  boxShadow: isMobile
                    ? '0 0 18px rgba(255, 255, 255, 0.95)'
                    : '0 0 35px rgba(255, 255, 255, 0.98), 0 -12px 25px rgba(255, 255, 255, 0.8)',
                  filter: isMobile ? 'blur(3px)' : 'blur(6px)',
                  borderRadius: '50%'
                }} />

                {/* Translucent Realistic Soap Bubbles */}
                {bubbles.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      position: 'absolute',
                      left: b.left,
                      top: `${b.offsetY}px`,
                      width: `${b.size}px`,
                      height: `${b.size}px`,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, rgba(255, 255, 255, 0.9) 35%, rgba(240, 249, 255, 0.45) 70%, rgba(255, 255, 255, 0.75) 100%)',
                      boxShadow: isMobile
                        ? '0 2px 6px rgba(255, 255, 255, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.9)'
                        : '0 4px 15px rgba(255, 255, 255, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.9), inset 0 -3px 6px rgba(186, 230, 253, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      backdropFilter: isMobile ? 'none' : 'blur(2px)',
                      WebkitBackdropFilter: isMobile ? 'none' : 'blur(2px)',
                      opacity: b.opacity,
                      animation: `gentleBubbleFloat ${b.animDuration}s ease-in-out ${b.animDelay}s infinite`,
                      willChange: 'transform'
                    }}
                  />
                ))}

                {/* Airborne Soap Bubbles flying upwards off the top of the foam layer */}
                {flyingBubbles.map((fb) => (
                  <div
                    key={`fly-${fb.id}`}
                    style={{
                      position: 'absolute',
                      left: fb.left,
                      top: isMobile ? '-8px' : '-15px',
                      width: `${fb.size}px`,
                      height: `${fb.size}px`,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, rgba(255, 255, 255, 0.92) 40%, rgba(224, 242, 254, 0.45) 75%, rgba(255, 255, 255, 0.8) 100%)',
                      boxShadow: isMobile
                        ? '0 2px 5px rgba(255, 255, 255, 0.7)'
                        : '0 4px 12px rgba(255, 255, 255, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      backdropFilter: isMobile ? 'none' : 'blur(1.5px)',
                      WebkitBackdropFilter: isMobile ? 'none' : 'blur(1.5px)',
                      animation: `${fb.animName} ${fb.animDuration}s ease-in-out ${fb.animDelay}s infinite`,
                      willChange: 'transform'
                    }}
                  />
                ))}
              </div>
            );
          })()}

        </div>

      </div>
    </section>
  );
}
