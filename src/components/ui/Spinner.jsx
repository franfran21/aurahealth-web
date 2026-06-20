import React from 'react';

export const Spinner = ({ size = 'md', color = 'brand', className = '' }) => {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-4',
  };

  const colors = {
    brand: 'border-brand-primary border-t-transparent',
    accent: 'border-accent-pink border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizes[size]} ${colors[color]} ease-linear`}
      />
    </div>
  );
};

export default Spinner;
