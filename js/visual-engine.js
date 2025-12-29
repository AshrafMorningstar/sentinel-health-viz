function initVisualEngine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    
    // State
    let width, height;
    let bioState = {
        pulseSpeed: 0.02,
        breathAmplitude: 10,
        tension: 0,
        particleSpeed: 1,
        healthColor: { r: 0, g: 255, b: 136 }
    };

    // Performance tracking
    let lastFrameTime = performance.now();
    let fps = 60;
    let frameCount = 0;
    let fpsUpdateTime = performance.now();

    // Animation vars
    let time = 0;
    let particles = [];
    let energyWaves = [];
    let dnaParticles = [];
    const NUM_PARTICLES = 80; // Increased for richer visuals
    const NUM_WAVES = 5;
    const NUM_DNA = 40;

    // Resize Handler with devicePixelRatio for crisp rendering
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    // Enhanced Particle Class with trails
    class Particle {
        constructor() {
            this.reset();
            this.trail = [];
        }

        reset() {
            this.angle = Math.random() * Math.PI * 2;
            this.radius = 100 + Math.random() * 250;
            this.size = Math.random() * 4 + 1.5;
            this.speed = (Math.random() * 0.015 + 0.008) * (Math.random() < 0.5 ? 1 : -1);
            this.alpha = Math.random() * 0.6 + 0.3;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.angle += this.speed * bioState.particleSpeed;
            const x = width / 2 + Math.cos(this.angle) * this.radius;
            const y = height / 2 + Math.sin(this.angle) * this.radius;
            
            // Trail effect
            this.trail.push({ x, y });
            if (this.trail.length > 3) this.trail.shift();
            
            // Draw trail
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                const trailAlpha = (i / this.trail.length) * this.alpha * 0.3;
                ctx.fillStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${trailAlpha})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Pulsing effect
            const pulseFactor = 1 + Math.sin(time * 3 + this.pulsePhase) * 0.3;
            ctx.fillStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, this.size * pulseFactor, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Energy Wave Class
    class EnergyWave {
        constructor(delay) {
            this.delay = delay;
            this.radius = 0;
            this.maxRadius = 400;
            this.alpha = 0.8;
        }

        update() {
            if (this.delay > 0) {
                this.delay -= 1;
                return;
            }
            
            this.radius += 2 * bioState.pulseSpeed * 50;
            this.alpha = 1 - (this.radius / this.maxRadius);
            
            if (this.radius >= this.maxRadius) {
                this.radius = 0;
                this.alpha = 0.8;
            }
            
            ctx.strokeStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${this.alpha * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // DNA Helix Particles
    class DNAParticle {
        constructor(index) {
            this.index = index;
            this.angle = (index / NUM_DNA) * Math.PI * 2;
            this.height = (index / NUM_DNA) * 400 - 200;
        }

        update() {
            this.angle += 0.02 * bioState.particleSpeed;
            const radius = 180;
            const x = width / 2 + Math.cos(this.angle) * radius;
            const y = height / 2 + this.height + Math.sin(time * 2) * 20;
            
            // Opposite helix
            const x2 = width / 2 + Math.cos(this.angle + Math.PI) * radius;
            const y2 = height / 2 + this.height + Math.sin(time * 2) * 20;
            
            const alpha = 0.15;
            ctx.fillStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Connecting line
            ctx.strokeStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    // Init all particle systems
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < NUM_WAVES; i++) {
        energyWaves.push(new EnergyWave(i * 20));
    }
    for (let i = 0; i < NUM_DNA; i++) {
        dnaParticles.push(new DNAParticle(i));
    }

    // Main Render Loop with FPS optimization
    function animate(currentTime) {
        // FPS calculation
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        frameCount++;
        
        if (currentTime - fpsUpdateTime >= 1000) {
            fps = Math.round(frameCount * 1000 / (currentTime - fpsUpdateTime));
            frameCount = 0;
            fpsUpdateTime = currentTime;
        }

        // Clear with fade effect for motion blur
        ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
        ctx.fillRect(0, 0, width, height);

        // Update Time
        time += bioState.pulseSpeed;

        // 1. Draw DNA Helix (Background layer)
        dnaParticles.forEach(p => p.update());

        // 2. Draw Energy Waves
        energyWaves.forEach(w => w.update());

        // 3. Draw Flow/Orbit Lines with multiple layers
        for (let i = 0; i < 4; i++) {
            const offset = i * 40;
            const opacity = 0.08 - i * 0.015;
            ctx.strokeStyle = `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, 150 + offset + Math.sin(time + i) * 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 4. Draw Particles with enhanced effects
        particles.forEach(p => p.update());

        // 5. Draw Core Organism (The "Heart") with bloom
        const baseRadius = 70;
        const breath = Math.sin(time * 2) * bioState.breathAmplitude;
        const pulse = Math.abs(Math.sin(time * 4)) * 8;
        
        // Tension Jitter
        let jitterX = 0;
        let jitterY = 0;
        if (bioState.tension > 0) {
            jitterX = (Math.random() - 0.5) * bioState.tension;
            jitterY = (Math.random() - 0.5) * bioState.tension;
        }

        const coreRadius = baseRadius + breath + pulse;
        const centerX = width / 2 + jitterX;
        const centerY = height / 2 + jitterY;

        // Multi-layer bloom effect
        for (let i = 0; i < 3; i++) {
            const bloomRadius = coreRadius * (3 - i * 0.5);
            const bloomAlpha = 0.15 / (i + 1);
            const gradient = ctx.createRadialGradient(
                centerX, centerY, coreRadius * 0.1,
                centerX, centerY, bloomRadius
            );
            gradient.addColorStop(0, `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, ${bloomAlpha * 2})`);
            gradient.addColorStop(1, `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, bloomRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Inner glow
        const innerGlow = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, coreRadius
        );
        innerGlow.addColorStop(0, `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, 1)`);
        innerGlow.addColorStop(0.7, `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, 0.8)`);
        innerGlow.addColorStop(1, `rgba(${bioState.healthColor.r}, ${bioState.healthColor.g}, ${bioState.healthColor.b}, 0.4)`);
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core highlight
        const highlight = ctx.createRadialGradient(
            centerX - coreRadius * 0.3, centerY - coreRadius * 0.3, 0,
            centerX, centerY, coreRadius * 0.6
        );
        highlight.addColorStop(0, `rgba(255, 255, 255, 0.3)`);
        highlight.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(animate);
    }

    animate(performance.now());

    // Hook for external updates with smooth color transitions
    window.updateOrganismState = (newState) => {
        // Smooth color transition
        if (newState.healthColor) {
            const lerpFactor = 0.1;
            bioState.healthColor.r += (newState.healthColor.r - bioState.healthColor.r) * lerpFactor;
            bioState.healthColor.g += (newState.healthColor.g - bioState.healthColor.g) * lerpFactor;
            bioState.healthColor.b += (newState.healthColor.b - bioState.healthColor.b) * lerpFactor;
            delete newState.healthColor;
        }
        bioState = { ...bioState, ...newState };
    };

    // Expose FPS for debugging
    window.getSentinelFPS = () => fps;
}
