// frontend/src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: '🔮 Prediksi AI', href: '/' },
    { name: '📊 Dashboard Analytics', href: '/dashboard' },
    { name: '📈 Data Insights', href: '/insights' },
    { name: 'ℹ️ Model Info', href: '/model-info' },
  ];

  return (
    <nav style={{ 
      background: 'rgba(5, 25, 55, 0.8)', // Darker background for navbar (from brand-dark-blue)
      backdropFilter: 'blur(18px) saturate(200%)', // Stronger blur for Navbar glass
      WebkitBackdropFilter: 'blur(18px) saturate(200%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 25px rgba(0,0,0,0.3)', // Stronger shadow
      padding: '1.2rem 20px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '2.5rem',
      fontFamily: 'Poppins, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 25px 25px',
    }}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <span 
            style={{
              color: pathname === item.href ? 'var(--color-accent-main)' : 'var(--brand-white-blue)', // Accent blue for active, white-blue for inactive
              fontWeight: pathname === item.href ? '700' : '500',
              padding: '0.8rem 1.8rem',
              borderRadius: '20px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backgroundColor: pathname === item.href ? 'rgba(84, 142, 248, 0.2)' : 'transparent', 
              border: pathname === item.href ? '1px solid var(--color-accent-main)' : '1px solid transparent', 
            }}
            onMouseOver={(e) => {
              if (pathname !== item.href) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; 
                e.currentTarget.style.color = 'var(--brand-light-blue)'; // Bright blue on hover for inactive
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (pathname !== item.href) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--brand-white-blue)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
