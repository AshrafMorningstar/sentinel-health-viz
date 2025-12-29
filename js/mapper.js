class HealthMapper {
    map(metrics) {
        // 1. Determine Overall State
        let statusLabel = 'CALM';
        let healthColor = { r: 0, g: 255, b: 136 }; // Green/Teal
        
        // Stress Logic
        if (metrics.cpu > 50 || metrics.memory > 70) {
            statusLabel = 'STRESS';
            healthColor = { r: 255, g: 170, b: 0 }; // Orange
        }
        if (metrics.cpu > 80 || metrics.errors > 5) {
            statusLabel = 'CRITICAL';
            healthColor = { r: 255, g: 51, b: 51 }; // Red
        }

        // 2. Map CPU -> Heartbeat (Pulse Speed)
        // Base speed 0.02, max 0.1
        const pulseSpeed = 0.01 + (metrics.cpu / 100) * 0.08;

        // 3. Map Memory -> Breathing Depth (Scale Amplitude)
        // Base scale variance 10%, max 30%
        const breathAmplitude = 10 + (metrics.memory / 100) * 20;

        // 4. Map Errors -> Tension (Jitter/Shaking)
        const tension = Math.min(metrics.errors * 2, 20); // Limit max jitter

        // 5. Map Network -> Particle Activity (Twitch/Flow)
        const particleSpeed = 0.5 + (metrics.network / 50);

        return {
            statusLabel,
            healthColor,
            pulseSpeed,
            breathAmplitude,
            tension,
            particleSpeed
        };
    }
}
