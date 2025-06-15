// frontend/src/components/GlassChartCard.tsx
import React from 'react';

interface GlassChartCardProps {
  title: string;
  children: React.ReactNode;
  height?: string; // Optional height for consistent chart sizing
  minWidth?: string; // Optional minWidth for responsive layout
  flexGrow?: number; // New prop: to control flex-grow of the card
}

export default function GlassChartCard({ title, children, height = '400px', minWidth = '45%', flexGrow = 1 }: GlassChartCardProps) {
  const glassCardStyle: React.CSSProperties = {
    background: 'var(--color-glass-bg)', 
    borderRadius: '25px', 
    boxShadow: '0 8px 32px 0 var(--color-glass-shadow)', 
    backdropFilter: 'blur(8px) saturate(180%)', 
    WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    border: '1px solid var(--color-glass-border)', 
    padding: '30px', // Consistent padding
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-start', // Align items to start, charts fill available space
    height: height,
    maxHeight: '100%', // Ensure it doesn't exceed parent height
    minWidth: minWidth,
    flex: flexGrow, // Use flexGrow prop
    position: 'relative', 
    overflow: 'hidden', // Hide overflow for rounded corners
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    color: 'var(--color-text-main)', 
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '25px', // More space below title
    textAlign: 'center',
    width: '100%', // Ensure title takes full width
  };

  return (
    <div style={glassCardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      {/* Chart container needs to take remaining height to render charts properly */}
      <div style={{ width: '100%', flexGrow: 1, position: 'relative' }}> {/* Use flexGrow to fill remaining height */}
        {children}
      </div>
    </div>
  );
}
