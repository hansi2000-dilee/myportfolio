import React, { useEffect, useRef } from 'react';

const ComplexBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Configuration
    const particleCount = 120; // Increased from 70
    const connectionDistance = 150;
    const mouseDistance = 250;

    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 3 + 1;
        // Mix of Gold/Yellow and subtle Purple
        this.isGold = Math.random() > 0.2; // 80% Gold
        this.color = this.isGold 
          ? `rgba(251, 191, 36, ${Math.random() * 0.8 + 0.2})` 
          : `rgba(147, 51, 234, ${Math.random() * 0.5 + 0.2})`;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.shape = Math.floor(Math.random() * 3); // 0: Circle, 1: Square, 2: Triangle
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouseDistance;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        if (this.shape === 0) { // Circle
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else if (this.shape === 1) { // Square
            ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        } else if (this.shape === 2) { // Triangle
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size, this.y + this.size);
            ctx.lineTo(this.x - this.size, this.y + this.size);
            ctx.closePath();
        }
        
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.fillStyle = 'rgba(17, 3, 31, 0.5)'; 
        ctx.fillRect(0, 0, width, height);
        
        // Draw connections
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - (distance / connectionDistance);
                    // Gradient Line
                    let grad = ctx.createLinearGradient(particles[a].x, particles[a].y, particles[b].x, particles[b].y);
                    grad.addColorStop(0, 'rgba(251, 191, 36,' + opacity + ')'); // Gold
                    grad.addColorStop(1, 'rgba(147, 51, 234,' + opacity + ')'); // Purple
                    
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.2; // Ultra slim lines
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', () => {});
        window.removeEventListener('mouseleave', () => {});
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1, 
        pointerEvents: 'none',
        background: '#050505'
      }} 
    />
  );
};

export default ComplexBackground;
