import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full tracking-wide transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 focus:ring-offset-obsidian disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald text-obsidian hover:bg-[#00e6ac] hover:shadow-[0_0_15px_rgba(0,200,150,0.4)]',
    ghost: 'bg-transparent border border-emerald text-emerald hover:bg-emerald/10',
    danger: 'bg-coral text-white hover:bg-[#ff8585]',
    flat: 'bg-surface-2 text-text-primary hover:bg-surface-2/80'
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-8 py-3.5'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
