// frontend/src/app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import React from 'react';

export const metadata = {
  title: 'SecureBank AI - Decentralized Insight',
  description: 'AI-powered system for predicting bank term deposit subscriptions with a modern, data-centric approach.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts diimpor di globals.css sekarang */}
      </head>
      <body>
        <Navbar />
        {/* Main Glassmorphism Container: This wraps all page content */}
        <div style={{ // Using a div here, which will be centered by body's flex
          background: 'var(--color-glass-bg)', // Use glass background variable
          borderRadius: '35px', // More rounded
          boxShadow: '0 8px 32px 0 var(--color-glass-shadow)', // Glassmorphism shadow
          backdropFilter: 'blur(15px) saturate(180%)', // Stronger blur
          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
          border: '1px solid var(--color-glass-border)', // Subtle glass border
          margin: '30px auto', // Auto margin for horizontal centering, 30px top/bottom
          maxWidth: '1300px', // Wider container
          width: 'calc(100% - 60px)', // Occupy full width minus margins
          padding: '20px', // Padding inside the glass container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center content horizontally within the glass box
          minHeight: 'calc(100vh - 60px - 80px)', // Adjust height based on navbar and margin
          overflow: 'hidden', // Crucial for border-radius and blur
          position: 'relative',
          zIndex: 1,
        }}>
          {children} {/* Page content goes here */}
        </div>
      </body>
    </html>
  );
}
