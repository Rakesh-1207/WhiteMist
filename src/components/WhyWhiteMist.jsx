import React from 'react';
import { Sparkles, ShieldCheck, Zap, Thermometer, Volume2, Droplets } from 'lucide-react';

export default function WhyWhiteMist() {
  const features = [
    {
      icon: <Thermometer size={32} style={{ color: '#0084FF' }} />,
      bg: '#E6F3FF',
      title: "70°C Hot Sterilization",
      desc: "Eliminates 99.99% of bacteria, viruses, and stubborn grease from Indian kadhais, oily pans, and baby bottles."
    },
    {
      icon: <Volume2 size={32} style={{ color: '#F01262' }} />,
      bg: '#FFEBF2',
      title: "40dB Whisper Quiet",
      desc: "Acoustic insulation panels and BLDC EcoSilent motors ensure disturbance-free washing, perfect for night cycles."
    },
    {
      icon: <Droplets size={32} style={{ color: '#D97706' }} />,
      bg: '#FFFDE6',
      title: "70% Water Saving",
      desc: "Uses only 9.5 liters of water per eco cycle compared to 40+ liters required during traditional manual tap handwashing."
    },
    {
      icon: <ShieldCheck size={32} style={{ color: '#16A34A' }} />,
      bg: '#DCFCE7',
      title: "2-Year Direct Warranty",
      desc: "Comprehensive door-step coverage, free installation by certified technicians, and 10-year motor guarantee."
    }
  ];

  return (
    <section id="why-white-mist" style={{ padding: '5rem 0', background: 'white' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ 
            color: 'var(--color-purple-primary)', 
            fontWeight: '800', 
            fontSize: '0.85rem', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase' 
          }}>
            THE WHITE MIST APPLIANCE ADVANTAGE
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: 'var(--color-purple-dark)' }}>
            Why Commercial & Home Kitchens Trust White Mist
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Engineered with high-pressure bio-enzyme water jets, surgical grade stainless steel, and intelligent sensors for superior cleanliness.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feat, idx) => (
            <div key={idx} style={{
              background: '#FAFCFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              border: '1px solid #E2E8F0',
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(39, 13, 91, 0.08)';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}>
              
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: feat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {feat.icon}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {feat.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
