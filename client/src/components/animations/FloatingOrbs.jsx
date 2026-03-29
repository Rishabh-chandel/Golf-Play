import React from 'react';
import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-emerald/10 blur-[100px]"
      />
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -40, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-gold/10 blur-[120px]"
      />
    </div>
  );
};
