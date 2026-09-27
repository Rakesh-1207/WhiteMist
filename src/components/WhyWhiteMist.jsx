import React from 'react';
import { Sparkles, Waves, Cpu, Leaf, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function WhyWhiteMist() {
  const features = [
    {
      icon: <Sparkles size={32} style={{ color: '#0084FF' }} />,
      bg: '#E6F3FF',
      title: "10x Bio-Enzyme Stain Action",
      desc: "Targeted quad-enzymes penetrate deep into cotton & synthetic fibers to breakdown oil, tea, grease, ink, and sweat without scrubbing or fabric damage."
    },
    {
      icon: <Waves size={32} style={{ color: '#3F1B85' }} />,
      bg: '#F3EBFD',
      title: "Front & Top Load Formulated",
      desc: "Engineered with anti-foaming polymers to protect front-load sensors while providing deep agitation power for top-load washing machines."
    },
    {
      icon: <HeartHandshake size={32} style={{ color: '#F01262' }} />,
      bg: '#FFEBF2',
      title: "48-Hour Micro-Capsule Scent",
      desc: "Encapsulated fragrance beads bind to threads and release fresh bursts of ocean, rose, or citrus scents with every touch and body movement."
    },
    {
      icon: <Leaf size={32} style={{ color: '#16A34A' }} />,
      bg: '#DCFCE7',
      title: "Eco Spout Pouch Refills",
      desc: "Our flexible 2kg refill pouches cut plastic footprint by 70% compared to standard bottles. Reuse your ergonomic bottle endlessly!"
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
            THE WHITE MIST ADVANTAGE
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: 'var(--color-purple-dark)' }}>
            Why Families & Caregivers Trust White Mist
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Crafted by Meridian FMCG labs to deliver premium wash quality, vibrant fabric color lock, and long-lasting freshness in every single capful.
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
