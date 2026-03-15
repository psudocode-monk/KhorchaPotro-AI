'use client';

import { useCallback } from 'react';

// A simple hook to generate a subtle "bloop" or "chime" sound using Web Audio API
export function useNotificationSound() {
  const playSound = useCallback(() => {
    try {
      // Create audio context only when needed to comply with browser autoplay policies
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // A pleasant "sine" wave ping
      oscillator.type = 'sine';
      
      // Starting frequency
      oscillator.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      // Slide up slightly
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5

      // Volume envelope (quick attack, slightly slower release)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      
      // Cleanup context after sound finishes to free resources
      setTimeout(() => {
        if (ctx.state !== 'closed') {
           ctx.close();
        }
      }, 500);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked', e);
    }
  }, []);

  return playSound;
}
