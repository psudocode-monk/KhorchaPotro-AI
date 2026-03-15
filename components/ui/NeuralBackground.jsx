'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Adjust canvas size to window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Configuration
    const particleCount = 60; // "quite a few"
    const maxDistance = 150; // Distance to form lines
    const particles = [];

    // Colors based on theme (subtle emerald/cyan hues)
    const getColors = () => {
      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
      return {
        dot: isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(5, 150, 105, 0.2)', // Emerald tint
        line: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.08)' // Cyan tint
      };
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Very slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw(colors) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.dot;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getColors();

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(colors);
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Fading lines based on distance
            const opacity = 1 - (distance / maxDistance);
            // Extract rgb from rgba to inject opacity
            const match = colors.line.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                const baseOpacity = parseFloat(match[4] || 1);
                ctx.strokeStyle = `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity * baseOpacity})`;
            } else {
                 ctx.strokeStyle = colors.line;
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-render if theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-transparent"
    />
  );
}
