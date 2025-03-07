'use client';

import React from 'react';
import { ButtonProps } from '@/types';

const Button = ({ onClick, children, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      tabIndex={0}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      {children}
    </button>
  );
};

export default Button; 