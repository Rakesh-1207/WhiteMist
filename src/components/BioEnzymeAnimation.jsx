import React, { useState, useRef } from 'react';
import { Zap, Play, Pause } from 'lucide-react';

export default function BioEnzymeAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
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

            <p className="bio-enzyme-desc" style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              White Mist formula contains quad bio-active enzymes (*Protease, Lipase, Amylase & Cellulase*) that target deep fabric weaves, locking onto oil and sweat molecules to dissolve them without harsh chemicals.
            </p>
          </div>

          {/* Right Video Card */}
          <div className="bio-enzyme-card" style={{
            position: 'relative',
            height: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(63, 27, 133, 0.15)',
            border: '4px solid #F8FAFC',
            background: '#0B0F19',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              ref={videoRef}
              src="/assets/video/durt-bio-reaction.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Video Live Badge Overlay */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 3
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 8px #22C55E' }}></span>
              <span>Bio-Reaction Live</span>
            </div>

            {/* Play/Pause Overlay Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause reaction video' : 'Play reaction video'}
              title={isPlaying ? 'Pause' : 'Play'}
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-purple-dark)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'var(--transition)',
                zIndex: 3
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
