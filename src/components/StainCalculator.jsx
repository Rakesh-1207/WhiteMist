import React, { useState } from 'react';
import { Droplet, Shirt, Star, Coins, Sparkles, Hand } from 'lucide-react';

export default function StainCalculator({ onAddToCart: _onAddToCart }) {
  const [machineType, setMachineType] = useState('front');
  const [loadSize, setLoadSize] = useState('medium');
  const [stainLevel, setStainLevel] = useState('tough');

  // Dosage computation logic
  const calculateDose = () => {
    let cap = 1;
    let ml = 40;
    let variant = 'wm-blue-ocean';
    let variantName = 'White Mist Ocean Fresh (Blue)';
    let variantColor = '#0084FF';
    let costPerWash = 3.50;

    if (loadSize === 'small') { cap = 0.75; ml = 30; }
    if (loadSize === 'heavy') { cap = 1.5; ml = 60; }

    if (stainLevel === 'tough' || stainLevel === 'heavy') {
      variant = 'wm-yellow-citrus';
      variantName = 'White Mist Citrus Sunshine (Yellow)';
      variantColor = '#FFB800';
    } else if (stainLevel === 'delicate') {
      variant = 'wm-pink-floral';
      variantName = 'White Mist Floral Bloom (Pink)';
      variantColor = '#F01262';
    }

    if (machineType === 'front') {
      costPerWash = (ml * 0.087).toFixed(2);
    } else {
      costPerWash = (ml * 0.092).toFixed(2);
    }

    return { cap, ml, variant, variantName, variantColor, costPerWash };
  };

  const result = calculateDose();

  return (
    <section id="stain-calculator" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #3F1B85 0%, #270D5B 100%)', color: 'white' }}>
      <div className="container">
        
        {/* DESKTOP VIEW - Unchanged */}
        <div className="calc-desktop-view">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }} className="calc-grid">

            {/* Left Text Explanation */}
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: 1.15 }}>
                Find Your Perfect Dose &amp; Variant
              </h2>

              <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                Overdosing laundry liquid wastes money and clogs machine pipes. Our precision bio-enzyme formula cleans thoroughly with up to 30% less detergent per wash!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,132,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0084FF' }}>
                    <Droplet size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Zero Residue Polymer Tech</div>
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Rinses clean completely in 1 single cycle</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,184,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB800' }}>
                    <Shirt size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Protects High-End Fabric Colors</div>
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Keeps darks dark and whites brilliant</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Calculator Box */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              color: 'var(--text-main)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Select Your Washing Preferences
              </h3>

              {/* Step 1: Machine Type */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  1. Washing Machine Type:
                </label>
                <div className="calc-step-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'front', label: 'Front Load' },
                    { id: 'top', label: 'Top Load' },
                    { id: 'hand', label: 'Hand Wash' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setMachineType(item.id)}
                      type="button"
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: machineType === item.id ? '2px solid var(--color-purple-primary)' : '1px solid #CBD5E1',
                        background: machineType === item.id ? '#F3EBFD' : 'white',
                        color: machineType === item.id ? 'var(--color-purple-dark)' : '#64748B',
                        fontWeight: '700',
                        fontSize: '0.825rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Load Weight */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  2. Load Size (Cloth Weight):
                </label>
                <div className="calc-step-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'small', label: 'Small (4-5 kg)' },
                    { id: 'medium', label: 'Regular (6-8 kg)' },
                    { id: 'heavy', label: 'Heavy (8-10 kg)' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setLoadSize(item.id)}
                      type="button"
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: loadSize === item.id ? '2px solid var(--color-purple-primary)' : '1px solid #CBD5E1',
                        background: loadSize === item.id ? '#F3EBFD' : 'white',
                        color: loadSize === item.id ? 'var(--color-purple-dark)' : '#64748B',
                        fontWeight: '700',
                        fontSize: '0.825rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Stain Level */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  3. Stain / Soil Condition:
                </label>
                <div className="calc-step-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'normal', label: 'Regular Daily' },
                    { id: 'tough', label: 'Tea / Oil Stains' },
                    { id: 'delicate', label: 'Silk / Delicates' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setStainLevel(item.id)}
                      type="button"
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: stainLevel === item.id ? '2px solid var(--color-purple-primary)' : '1px solid #CBD5E1',
                        background: stainLevel === item.id ? '#F3EBFD' : 'white',
                        color: stainLevel === item.id ? 'var(--color-purple-dark)' : '#64748B',
                        fontWeight: '700',
                        fontSize: '0.825rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Display Box */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1.5px solid #E2E8F0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recommended Dose &amp; Variant:
                </div>

                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)', margin: '0.3rem 0' }}>
                  {result.cap} Cap <span style={{ fontSize: '1.1rem', color: '#0084FF' }}>({result.ml} ml)</span>
                </div>

                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '700', 
                  color: '#1E1B4B', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}>
                  <Star size={16} fill="#FFB800" stroke="#FFB800" />
                  <span>{result.variantName}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '0.75rem', 
                  fontSize: '0.825rem', 
                  color: '#166534', 
                  fontWeight: '600',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Coins size={15} style={{ color: '#16A34A' }} />
                    Only ₹{result.costPerWash} per wash
                  </span>
                  <span style={{ color: '#94A3B8' }}>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Droplet size={15} style={{ color: '#0084FF', fill: '#0084FF' }} />
                    Saves 25L water/cycle
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* MOBILE PROTOTYPE VIEW - 100% matches Figma Mobile Design */}
        <div className="calc-mobile-view" style={{ maxWidth: '440px', margin: '0 auto' }}>
          
          {/* Mobile Header */}
          <div style={{ marginBottom: '1.2rem' }}>
            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: '800',
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '0.45rem',
              letterSpacing: '-0.02em'
            }}>
              Perfect Dose &amp;<br />Perfect Clean
            </h2>
            <p style={{
              fontSize: '0.84rem',
              color: '#D8B4FE',
              lineHeight: 1.45,
              margin: 0
            }}>
              Too much liquid wastes money and clogs machine pipes. Our advanced formula cleans thoroughly with up to 30% less.
            </p>
          </div>

          {/* White Card Container */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '1rem 0.9rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            color: 'var(--text-main)'
          }}>
            <h3 style={{
              fontSize: '1.08rem',
              fontWeight: '800',
              color: 'var(--color-purple-dark)',
              marginBottom: '0.75rem'
            }}>
              Select Your Washing Preferences
            </h3>

            {/* Step 1: Washing Machine Type */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#F3E8FF',
                  color: '#6B21A8',
                  fontWeight: '800',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  1
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B' }}>
                  Washing machine type
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                {[
                  {
                    id: 'front',
                    label: 'Front Load',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="16" height="18" rx="2.5" />
                        <circle cx="12" cy="13" r="4.2" />
                        <line x1="9" y1="10" x2="15" y2="16" />
                        <circle cx="8" cy="6" r="0.8" fill="currentColor" />
                        <line x1="12" y1="6" x2="16" y2="6" />
                      </svg>
                    )
                  },
                  {
                    id: 'top',
                    label: 'Top Load',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="16" height="18" rx="2.5" />
                        <circle cx="12" cy="12" r="4.2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="7.5" y1="19" x2="16.5" y2="19" />
                      </svg>
                    )
                  },
                  {
                    id: 'hand',
                    label: 'Hand Wash',
                    icon: <Hand size={20} strokeWidth={1.8} />
                  }
                ].map(item => {
                  const isSelected = machineType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setMachineType(item.id)}
                      type="button"
                      style={{
                        padding: '0.45rem 0.25rem',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #6D28D9' : '1px solid #E2E8F0',
                        background: isSelected ? '#F3EBFD' : '#FFFFFF',
                        color: isSelected ? 'var(--color-purple-dark)' : '#64748B',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '52px',
                        outline: 'none'
                      }}
                    >
                      <div style={{ color: isSelected ? 'var(--color-purple-dark)' : '#64748B' }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: isSelected ? '700' : '600', lineHeight: 1.15 }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Load Size */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#F3E8FF',
                  color: '#6B21A8',
                  fontWeight: '800',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B', lineHeight: 1.2 }}>
                    Load size
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748B' }}>
                    Cloth weight
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                {[
                  { id: 'small', label: 'Small', sub: '(4–5 kg)' },
                  { id: 'medium', label: 'Regular', sub: '(6–8 kg)' },
                  { id: 'heavy', label: 'Large', sub: '(9+ kg)' }
                ].map(item => {
                  const isSelected = loadSize === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setLoadSize(item.id)}
                      type="button"
                      style={{
                        padding: '0.35rem 0.25rem',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #6D28D9' : '1px solid #E2E8F0',
                        background: isSelected ? '#F3EBFD' : '#FFFFFF',
                        color: isSelected ? 'var(--color-purple-dark)' : '#64748B',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.12rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '44px',
                        outline: 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? '700' : '600', color: isSelected ? 'var(--color-purple-dark)' : '#64748B' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '0.64rem', color: isSelected ? '#5B21B6' : '#94A3B8' }}>
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Stain / Soil Condition */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#F3E8FF',
                  color: '#6B21A8',
                  fontWeight: '800',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E293B' }}>
                  Stain / soil condition
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
                {[
                  { id: 'normal', label: 'Regular Daily' },
                  { id: 'tough', label: 'Tea / Oil Stains' },
                  { id: 'heavy', label: 'Heavy Dirt / Mud' }
                ].map(item => {
                  const isSelected = stainLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStainLevel(item.id)}
                      type="button"
                      style={{
                        padding: '0.38rem 0.7rem',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #6D28D9' : '1px solid #E2E8F0',
                        background: isSelected ? '#F3EBFD' : '#FFFFFF',
                        color: isSelected ? 'var(--color-purple-dark)' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        outline: 'none'
                      }}
                    >
                      {/* Custom Radio Button */}
                      <div style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--color-purple-dark)' : '2px solid #CBD5E1',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isSelected && (
                          <div style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'var(--color-purple-dark)'
                          }} />
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? 'var(--color-purple-dark)' : '#475569'
                      }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommended Dose & Variant Box */}
            <div style={{
              background: '#F8F5FF',
              borderRadius: '14px',
              border: '1px solid #E9D5FF',
              padding: '0.75rem 0.75rem 0.65rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: '#6B21A8',
                fontSize: '0.65rem',
                fontWeight: '800',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.2rem'
              }}>
                <Sparkles size={12} style={{ color: '#6B21A8' }} />
                <span>RECOMMENDED DOSE &amp; VARIANT</span>
              </div>

              <div style={{ textAlign: 'center', margin: '0.1rem 0 0.25rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>
                  {result.cap} Cap
                </span>{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0084FF' }}>
                  ({result.ml} ml)
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#1E1B4B',
                marginBottom: '0.45rem'
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: result.variantColor,
                  display: 'inline-block',
                  flexShrink: 0
                }} />
                <span>{result.variantName}</span>
              </div>

              <div style={{ height: '1px', background: '#E9D5FF', margin: '0.45rem 0' }} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 0.1rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#166534'
                }}>
                  <Coins size={12} style={{ color: '#16A34A' }} />
                  <span>Only ₹{result.costPerWash} per wash</span>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#047857'
                }}>
                  <Droplet size={12} style={{ color: '#059669' }} />
                  <span>Saves 25L water</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
