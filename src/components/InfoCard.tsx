// frontend/src/components/InfoCard.tsx
import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  minWidth?: string; // Optional minWidth for responsive layout
  flexGrow?: number; // Optional prop: to control flex-grow of the card
}

export default function InfoCard({ title, children, minWidth = '400px', flexGrow = 1 }: InfoCardProps) {
  const infoCardStyle: React.CSSProperties = {
    background: 'var(--color-glass-bg)', // Use glass background variable
    borderRadius: '25px', // Consistent rounding
    boxShadow: '0 8px 32px 0 var(--color-glass-shadow)', // Softer shadow
    backdropFilter: 'blur(8px) saturate(180%)', // Blur for inner cards
    WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    border: '1px solid var(--color-glass-border)', // Lighter border
    padding: '30px',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'flex-start', // Align items to start, useful for lists
    justifyContent: 'flex-start', // Align content to the top
    minWidth: minWidth,
    flex: flexGrow, // Use flexGrow prop
    overflow: 'hidden', // Hide overflow for rounded corners, content handles wrapping
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    color: 'var(--color-text-main)', // Dark text for titles inside card
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '25px', // More space below title
    textAlign: 'center',
    width: '100%', // Ensure title takes full width
  };

  return (
    <div style={infoCardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={{ width: '100%', overflow: 'hidden' }}> {/* Inner container for content */}
        {children}
      </div>
    </div>
  );
}
