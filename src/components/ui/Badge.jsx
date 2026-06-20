import React from 'react';

export const Badge = ({
  children,
  variant = 'brand',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors';

  const variants = {
    brand: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    accent: 'bg-accent-pink text-brand-primary border-accent-pink/30',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    gray: 'bg-gray-100 text-gray-500 border-gray-200',
    lutea: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    ovulacion: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
  };

  return (
    <span className={`${baseStyle} ${variants[variant] || variants.brand} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
