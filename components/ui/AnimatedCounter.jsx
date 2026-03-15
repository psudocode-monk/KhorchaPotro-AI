'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Use Spring for smooth motion
  const springValue = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  // Transform spring value to formatted string
  const displayValue = useTransform(springValue, (latest) => {
    return Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [value, springValue, isInView]);

  return (
    <span ref={ref}>
      ₹<motion.span>{displayValue}</motion.span>
    </span>
  );
}
