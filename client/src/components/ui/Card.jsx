import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

export const Card = ({ className, children, hoverEffect = false, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)' } : {}}
      className={cn("glass-card rounded-2xl p-6", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
