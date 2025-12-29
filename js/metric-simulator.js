class MetricSimulator {
    constructor() {
        this.cpu = 20; // %
        this.memory = 30; // %
        this.errors = 0; // count
        this.network = 10; // throughput arbitrary units
        this.trend = 0; // -1 to 1, direction of stress
    }

    tick() {
        // Human-like randomness + trends
        
        // Randomly change trend direction occasionally
        if (Math.random() > 0.95) {
            this.trend = (Math.random() * 2 - 1); // New random trend
        }

        // Apply trend to CPU
        this.cpu += this.trend * 2 + (Math.random() * 4 - 2);
        this.cpu = Math.max(5, Math.min(95, this.cpu)); // Clamp 5-95%

        // Memory follows CPU loosely but slower
        this.memory += (this.cpu - this.memory) * 0.05 + (Math.random() * 2 - 1);
        this.memory = Math.max(10, Math.min(90, this.memory));

        // Network is spiky
        this.network = Math.max(0, this.network + (Math.random() * 20 - 10));
        if (Math.random() > 0.98) this.network = 200; // random spike

        // Errors happen when stressed (High CPU)
        if (this.cpu > 80 && Math.random() > 0.8) {
            this.errors += 1;
        } else if (Math.random() > 0.99) {
            this.errors = Math.max(0, this.errors - 1); // decay
        }

        return {
            cpu: this.cpu,
            memory: this.memory,
            errors: this.errors,
            network: this.network
        };
    }
}
