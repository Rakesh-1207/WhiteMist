import React, { useState } from 'react';
import { Zap, Play, CheckCircle, Sparkles, Droplet } from 'lucide-react';

export default function BioEnzymeAnimation() {
  const [washStep, setWashStep] = useState(0); // 0: Dirty, 1: Enzymes Penetrate, 2: Stain Dissolving, 3: Sparkling Clean
  const [isWashing, setIsWashing] = useState(false);

  const startWashProcess = () => {
    if (isWashing) return;
    setIsWashing(true);
    setWashStep(1);

    setTimeout(() => setWashStep(2), 1200);
    setTimeout(() => setWashStep(3), 2800);
    setTimeout(() => {
      setIsWashing(false);
    }, 3600);
  };

  const resetWash = () => {
    setWashStep(0);
    setIsWashing(false);
  };

  return (
    <section style={{ padding: '5rem 0', background: '#FFFFFF' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }} className="bio-enzyme-grid">

          {/* Left Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#FFEBF2', color: '#F01262', fontWeight: '800', fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1rem' }}>
              <Zap size={16} /> 3D BIO-ENZYME MOLECULAR TECH
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '1.25rem', lineHeight: '1.15' }}>
              Watch Bio-Enzymes Break Down Grease In Real Time
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              White Mist formula contains quad bio-active enzymes (*Protease, Lipase, Amylase & Cellulase*) that target deep fabric weaves, locking onto oil and sweat molecules to dissolve them without harsh chemicals.
            </p>

            {/* Interactive Control Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={startWashProcess}
                disabled={isWashing}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                <Play size={18} fill="white" />
                <span>{isWashing ? 'Bio-Enzymes Cleaning...' : 'Simulate Bio-Wash Action'}</span>
              </button>

              {washStep === 3 && (
                <button
                  onClick={resetWash}
                  className="btn-secondary"
                  style={{ fontSize: '0.9rem' }}
                >
                  Reset Demo
                </button>
              )}
            </div>

            {/* Step Status Badges */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: washStep === 0 ? '#F1F5F9' : '#DCFCE7', color: washStep === 0 ? '#64748B' : '#15803D', fontSize: '0.8rem', fontWeight: '700' }}>
                1. Stained Fabric
              </div>
              <div style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: washStep === 1 ? '#E6F3FF' : (washStep > 1 ? '#DCFCE7' : '#F1F5F9'), color: washStep === 1 ? '#0084FF' : (washStep > 1 ? '#15803D' : '#64748B'), fontSize: '0.8rem', fontWeight: '700' }}>
                2. Enzyme Attack
              </div>
              <div style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: washStep === 2 ? '#FFEBF2' : (washStep > 2 ? '#DCFCE7' : '#F1F5F9'), color: washStep === 2 ? '#F01262' : (washStep > 2 ? '#15803D' : '#64748B'), fontSize: '0.8rem', fontWeight: '700' }}>
                3. Grease Dissolved
              </div>
              <div style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: washStep === 3 ? '#DCFCE7' : '#F1F5F9', color: washStep === 3 ? '#15803D' : '#64748B', fontSize: '0.8rem', fontWeight: '700' }}>
                4. 100% Sparkling
              </div>
            </div>
          </div>

          {/* Right Animated Fiber Card */}
          <div style={{
            position: 'relative',
            height: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(63, 27, 133, 0.15)',
            border: '4px solid #F8FAFC',
            backgroundImage: `url('/assets/images/fabric_bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

            {/* Stain Layer */}
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(146,64,14,0.85) 0%, rgba(180,83,9,0.4) 60%, transparent 100%)',
              filter: 'blur(12px)',
              transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: washStep === 0 ? 0.9 : (washStep === 1 ? 0.6 : (washStep === 2 ? 0.2 : 0)),
              transform: washStep === 2 ? 'scale(0.4)' : (washStep === 3 ? 'scale(0)' : 'scale(1)')
            }} />

            {/* Bio-Enzyme Pulse Micro-Bubbles (Appears on Wash Step 1 & 2) */}
            {(washStep === 1 || washStep === 2) && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: `${16 + (i * 6)}px`,
                      height: `${16 + (i * 6)}px`,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #38BDF8, #0284C7)',
                      boxShadow: '0 0 15px rgba(56, 189, 248, 0.8)',
                      animation: `pingPulse 1.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.12}s`,
                      transform: `translate(${(i % 3 - 1) * 70}px, ${(Math.floor(i / 3) - 1.5) * 60}px)`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Success Sparkle Overlay (Wash Step 3) */}
            {washStep === 3 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                animation: 'fadeIn 0.6s ease'
              }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#16A34A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)' }}>
                  <Sparkles size={36} />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-purple-dark)', background: 'white', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                  ✨ Pure Fabric Glow Restored!
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
