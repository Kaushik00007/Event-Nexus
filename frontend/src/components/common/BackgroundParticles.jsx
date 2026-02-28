import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PARTICLE_COUNT = 50; // Reduced from 100 for performance

const BackgroundParticles = () => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();
    const particleColorRef = useRef('rgba(99, 102, 241,');
    const animationFrameRef = useRef(null);
    const particlesRef = useRef([]);

    // Update particle color on theme change WITHOUT recreating canvas
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        particleColorRef.current = isDark ? 'rgba(99, 102, 241,' : 'rgba(56, 189, 248,';
    }, [theme]);

    // Initialize canvas and particles only once
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        let w, h;

        const resizeCanvas = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        // Initialize particles
        const particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
        particlesRef.current = particles;

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            const color = particleColorRef.current;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
                    p.x = Math.random() * w;
                    p.y = Math.random() * h;
                }
                ctx.fillStyle = `${color}${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []); // Only run once

    return (
        <canvas
            ref={canvasRef}
            className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-30'
                }`}
            style={{ background: 'transparent', willChange: 'opacity' }}
        />
    );
};

export default BackgroundParticles;
