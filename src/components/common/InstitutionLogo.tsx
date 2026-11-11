import React from 'react';

interface InstitutionLogoProps {
  type?: 'tut_wuri' | 'garuda' | 'kemdikbud' | 'custom';
  customUrl?: string;
  className?: string;
  size?: number;
}

export const InstitutionLogo: React.FC<InstitutionLogoProps> = ({
  type = 'tut_wuri',
  customUrl,
  className = 'w-10 h-10',
  size = 40,
}) => {
  if (type === 'custom' && customUrl) {
    return (
      <img
        src={customUrl}
        alt="Logo Instansi"
        className={`object-contain rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (type === 'garuda') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: size, height: size }}
        aria-label="Lambang Garuda"
      >
        <circle cx="50" cy="50" r="48" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <path
          d="M50 18L58 35H76L62 47L68 66L50 54L32 66L38 47L24 35H42L50 18Z"
          fill="#D97706"
        />
        <rect x="42" y="44" width="16" height="18" rx="2" fill="#DC2626" />
        <circle cx="50" cy="53" r="4" fill="#F8FAFC" />
        <path d="M30 76C42 72 58 72 70 76" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Default: Tut Wuri Handayani style emblem (education / institutional)
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size }}
      aria-label="Logo Tut Wuri Handayani"
    >
      <circle cx="50" cy="50" r="48" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
      {/* Outer gear / flower shape */}
      <polygon
        points="50,12 60,25 77,20 80,38 96,46 88,62 95,78 78,82 72,97 55,92 45,92 28,97 22,82 5,78 12,62 4,46 20,38 23,20 40,25"
        fill="#1D4ED8"
        opacity="0.15"
      />
      {/* Flame / Wings */}
      <path
        d="M50 22C42 34 32 46 28 62C38 64 45 56 50 48C55 56 62 64 72 62C68 46 58 34 50 22Z"
        fill="#2563EB"
      />
      {/* Center Belencong Torch */}
      <path
        d="M47 38H53V65C53 67 51 69 50 69C49 69 47 67 47 65V38Z"
        fill="#F59E0B"
      />
      {/* Open Book */}
      <path
        d="M26 68C36 65 46 67 50 72C54 67 64 65 74 68V80C64 77 54 79 50 84C46 79 36 77 26 80V68Z"
        fill="#1E40AF"
      />
      <circle cx="50" cy="34" r="5" fill="#EF4444" />
    </svg>
  );
};
