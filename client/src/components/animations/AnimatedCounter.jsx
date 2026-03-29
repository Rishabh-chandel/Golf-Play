import React, { useEffect, useState } from 'react';

export const useAnimatedCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out quad
      const easeOut = progress * (2 - progress);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

export const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 2000, className }) => {
  const count = useAnimatedCounter(value, duration);
  
  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};
