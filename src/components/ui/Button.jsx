import React from 'react';
import Spinner from './Spinner';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primaryLight shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20',
    secondary: 'bg-text-primary text-white hover:bg-text-primary/95',
    accent: 'bg-accent-pink text-brand-primary hover:bg-accent-pink/80',
    outline: 'border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary/5',
    text: 'text-text-secondary hover:text-brand-primary bg-transparent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Spinner size="xs" color={variant === 'accent' || variant === 'outline' ? 'brand' : 'white'} className="mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
