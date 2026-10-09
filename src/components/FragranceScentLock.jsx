import React, { useState } from 'react';
import { Heart, Sparkles, Wind, Droplets } from 'lucide-react';

export default function FragranceScentLock() {
  const [activeFragrance, setActiveFragrance] = useState('blue');
  const [isBursting, setIsBursting] = useState(false);

  const fragrances = {
    blue: {
      name: "Ocean Breeze Freshness",
      color: "#0084FF",
      bgGradient: "linear-gradient(135deg, #0084FF 0%, #0284C7 100%)",
      desc: "Micro-capsules burst upon touch releasing crisp sea-spray fragrance for up to 48 hours.",
      particlesColor: "#38BDF8"
    },
    pink: {
      name: "Pink Floral Bloom",
      color: "#F01262",
      bgGradient: "linear-gradient(135deg, #F01262 0%, #E11D48 100%)",
      desc: "Botanical rose extracts infuse garment fibers with long-lasting floral elegance.",
      particlesColor: "#FB7185"
    },
    yellow: {
      name: "Citrus Lemon Sunshine",
      color: "#D97706",
      bgGradient: "linear-gradient(135deg, #D97706 0%, #CA8A04 100%)",
      desc: "Zesty lemon aroma neutralizes body sweat odor and leaves laundry smelling sunny fresh.",
      particlesColor: "#FACC15"
    }
  };

  const triggerScentBurst = (key) => {
    setActiveFragrance(key);
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 2000);
  };

  const current = fragrances[activeFragrance];

  return (
    <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #1E1B4B 0%, #270D5B 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Animated Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: current.color,
        filter: 'blur(120px)',
        opacity: 0.35,
        transition: 'all 0.8s ease'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', color: '#FFB800', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Wind size={16} /> 48-HOUR MICRO-CAPSULE SCENT LOCK
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem' }}>
            Tap Fragrance Capsule to Release Aroma Waves
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            White Mist’s touch-activated scent technology embeds fragrance micro-beads deep into fabric weaves that burst softly as you move throughout the day.
          </p>
        </div>

        {/* Interactive Fragrance Selector Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {Object.keys(fragrances).map((key) => (
            <button
              key={key}
              onClick={() => triggerScentBurst(key)}
              style={{
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: activeFragrance === key ? `2px solid ${fragrances[key].color}` : '1px solid rgba(255,255,255,0.2)',
                background: activeFragrance === key ? fragrances[key].bgGradient : 'rgba(255,255,255,0.08)',
                color: 'white',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: activeFragrance === key ? `0 10px 25px ${fragrances[key].color}50` : 'none',
                transition: 'all 0.4s ease'
              }}
            >
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: fragrances[key].color, display: 'inline-block' }} />
              {fragrances[key].name}
            </button>
          ))}
        </div>

        {/* Center Interactive Scent Burst Display */}
        <div style={{
          position: 'relative',
          maxWidth: '650px',
          margin: '0 auto',
          padding: '3rem 2rem',
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}>

          {/* Scent Burst Orbs */}
          {isBursting && (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '32px', pointerEvents: 'none' }}>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${12 + (i * 4)}px`,
                    height: `${12 + (i * 4)}px`,
                    borderRadius: '50%',
                    background: current.particlesColor,
                    boxShadow: `0 0 20px ${current.particlesColor}`,
                    transform: `translate(-50%, -50%) translate(${(Math.cos(i) * 180)}px, ${(Math.sin(i) * 140)}px) scale(0)`,
                    animation: `burstOut 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: current.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: `0 15px 30px ${current.color}60` }}>
            <Sparkles size={40} color="white" />
          </div>

          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: 'white' }}>
            {current.name}
          </h3>

          <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
            {current.desc}
          </p>

        </div>

      </div>
    </section>
  );
}
