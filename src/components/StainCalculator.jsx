import React, { useState } from 'react';
import { Calculator, Sparkles, Droplet, Shirt, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StainCalculator({ onAddToCart }) {
  const [machineType, setMachineType] = useState('front');
  const [loadSize, setLoadSize] = useState('medium');
  const [stainLevel, setStainLevel] = useState('tough');

  // Dosage computation logic
  const calculateDose = () => {
    let cap = 1;
    let ml = 40;
    let variant = 'wm-blue-ocean';
    let variantName = 'White Mist Ocean Fresh (Blue)';
    let costPerWash = 3.50;

    if (loadSize === 'small') { cap = 0.75; ml = 30; }
    if (loadSize === 'heavy') { cap = 1.5; ml = 60; }

    if (stainLevel === 'tough' || stainLevel === 'heavy') {
      variant = 'wm-yellow-citrus';
      variantName = 'White Mist Citrus Sunshine (Yellow)';
    } else if (stainLevel === 'delicate') {
      variant = 'wm-pink-floral';
      variantName = 'White Mist Floral Bloom (Pink)';
    }

    if (machineType === 'front') {
      costPerWash = (ml * 0.087).toFixed(2);
    } else {
      costPerWash = (ml * 0.092).toFixed(2);
    }

    return { cap, ml, variant, variantName, costPerWash };
  };

  const result = calculateDose();

  return (
    <section id="stain-calculator" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #3F1B85 0%, #270D5B 100%)', color: 'white' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }} className="calc-grid">

          {/* Left Text Explanation */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 184, 0, 0.15)',
              border: '1px solid #FFB800',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1rem',
              marginBottom: '1rem',
              color: '#FFB800',
              fontSize: '0.85rem',
              fontWeight: '700'
            }}>
              <Calculator size={16} />
              <span>SMART LAUNDRY DOSAGE ESTIMATOR</span>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: 1.15 }}>
              Find Your Perfect Dose & Variant
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'front', label: 'Front Load' },
                  { id: 'top', label: 'Top Load' },
                  { id: 'hand', label: 'Hand Wash' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMachineType(item.id)}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'small', label: 'Small (4-5 kg)' },
                  { id: 'medium', label: 'Regular (6-8 kg)' },
                  { id: 'heavy', label: 'Heavy (8-10 kg)' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setLoadSize(item.id)}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'normal', label: 'Regular Daily' },
                  { id: 'tough', label: 'Tea / Oil Stains' },
                  { id: 'delicate', label: 'Silk / Delicates' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setStainLevel(item.id)}
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
                Recommended Dose & Variant:
              </div>

              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)', margin: '0.3rem 0' }}>
                {result.cap} Cap <span style={{ fontSize: '1.1rem', color: '#0084FF' }}>({result.ml} ml)</span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '0.5rem' }}>
                ⭐ {result.variantName}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.825rem', color: '#166534', fontWeight: '600' }}>
                <span>💰 Only ₹{result.costPerWash} per wash</span>
                <span>•</span>
                <span>💧 Saves 25L water/cycle</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
