import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onFinishLoading }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    const timer2 = setTimeout(() => {
      if (onFinishLoading) onFinishLoading();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinishLoading]);

  // Pure CSS 3D Soap Bubbles for Loading Screen
  const loadingBubbles = [
    { id: 'lb1', top: '15%', left: '10%', size: '90px', animation: 'bubbleDrift1 6s ease-in-out infinite' },
    { id: 'lb2', top: '65%', left: '8%', size: '60px', animation: 'bubbleDrift2 7.5s ease-in-out infinite' },
    { id: 'lb3', top: '20%', right: '12%', size: '110px', animation: 'bubbleDrift3 8s ease-in-out infinite' },
    { id: 'lb4', bottom: '15%', right: '10%', size: '85px', animation: 'bubbleDrift1 7s ease-in-out infinite' },
    { id: 'lb5', top: '45%', right: '5%', size: '70px', animation: 'bubbleDrift2 6.5s ease-in-out infinite' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'radial-gradient(circle at 50% 50%, #E6F3FF 0%, #FAFCFF 70%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.4s ease-out',
      pointerEvents: fadeOut ? 'none' : 'auto',
      overflow: 'hidden'
    }}>
      
      {/* Floating Translucent Soap Bubbles Background */}
      {loadingBubbles.map(b => (
        <div
          key={b.id}
          className="pure-css-bubble"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            animation: b.animation
          }}
        />
      ))}

      {/* Brand Logo & Pulsing Glow Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        
        {/* Soft Ambient Radial Glow behind Logo */}
        <div style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(0, 132, 255, 0.25)',
          filter: 'blur(40px)',
          animation: 'floatSlow 4s ease-in-out infinite',
          zIndex: 1
        }} />

        {/* Meridian White Mist Logo */}
        <div style={{ position: 'relative', zIndex: 2, animation: 'float 4s ease-in-out infinite' }}>
          <img 
            src="/assets/images/logo.png" 
            alt="Meridian White Mist Loading Logo"
            style={{
              height: '75px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 25px rgba(63, 27, 133, 0.2))'
            }}
          />
        </div>

        {/* Pure Cleanliness, Infinite Freshness Tagline */}
        <div style={{
          fontSize: '0.9rem',
          fontWeight: '700',
          color: 'var(--color-purple-primary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 2,
          marginTop: '0.25rem'
        }}>
          Pure Cleanliness, Infinite Freshness
        </div>

        {/* Blue Progress Fill Bar (As requested) */}
        <div style={{
          width: '240px',
          height: '6px',
          background: '#E2E8F0',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          marginTop: '0.5rem'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #1E1B4B 0%, #2563EB 50%, #0084FF 100%)',
            borderRadius: '999px',
            animation: 'loadingProgress 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }} />
        </div>

        {/* Three Dots Loading Animation Below Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '0.4rem',
          position: 'relative',
          zIndex: 2
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#0084FF',
            display: 'inline-block',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0s'
          }} />
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#0084FF',
            display: 'inline-block',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0.2s'
          }} />
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#0084FF',
            display: 'inline-block',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0.4s'
          }} />
        </div>

      </div>

    </div>
  );
}
