import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  onClick,
}) => {
  const baseStyle = 'rounded-2xl border border-white/40 p-6 bg-white overflow-hidden transition-all duration-300';
  
  const glassStyle = glass
    ? 'backdrop-blur-md bg-white/70 shadow-sm'
    : 'shadow-md shadow-brand-primary/5';

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/10 hover:border-brand-primary/10 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${glassStyle} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
