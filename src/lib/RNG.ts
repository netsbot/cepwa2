/**
 * Random number generator using Mulberry32 PRNG algorithm
 * Supports seeding with either strings or numbers for reproducible randomness
 */
export class RNG {
    static state: number;

    /**
     * Converts a string to a 32-bit integer hash value
     * Each character contributes to the final hash
     */
    private static stringToSeed(str: string): number {
        let seed = 0;
        for (let i = 0; i < str.length; i++) {
            seed = ((seed << 5) - seed) + str.charCodeAt(i);
            seed |= 0; // Convert to 32-bit integer
        }
        return seed >>> 0; // Ensure unsigned
    }

    /**
     * Sets the RNG seed to enable deterministic random sequences
     */
    static setSeed(seed: string | number) {
        if (typeof seed === "string") {
            RNG.state = RNG.stringToSeed(seed);
        } else {
            RNG.state = seed >>> 0;
        }
        console.log(`RNG seed set to: ${RNG.state}`);
    }

    /**
     * Returns a random float in range [0, 1)
     */
    static next(): number {
        let t = this.state += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        RNG.state = t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Returns a random integer in range [min, max] (inclusive)
     */
    static nextInt(min: number, max: number): number {
        return Math.floor(RNG.next() * (max - min + 1)) + min;
    }
}