import {Type} from "@lastolivegames/becsy";

/**
 * 2D vector class for position and movement calculations
 */
export class Vector {
    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add another vector to this one
     */
    add(that: Vector): void {
        this.x += that.x;
        this.y += that.y;
    }

    /**
     * Add scalar value to both components
     */
    addScalar(scalar: number): void {
        this.x += scalar;
        this.y += scalar;
    }

    /**
     * Subtract another vector from this one
     */
    sub(that: Vector): void {
        this.x -= that.x;
        this.y -= that.y;
    }

    /**
     * Multiply both components by scalar value
     */
    multScalar(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * Component-wise multiplication with another vector
     */
    mult(that: Vector): void {
        this.x *= that.x;
        this.y *= that.y;
    }

    /**
     * Divide both components by scalar value
     */
    div(scalar: number): void {
        this.x /= scalar;
        this.y /= scalar;
    }

    /**
     * Limit vector magnitude to maximum value
     */
    limit(max: number): void {
        const length = this.mag();
        if (length > max) {
            this.normalize();
            this.multScalar(max);
        }
    }

    /**
     * Calculate distance to another vector
     */
    dist(that: Vector): number {
        const dx = this.x - that.x;
        const dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Create a copy of this vector
     */
    copy(): Vector {
        return new Vector(this.x, this.y);
    }

    /**
     * Normalize this vector (make it unit length)
     */
    normalize(): void {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length > 0) {
            this.div(length);
        }
    }

    /**
     * Get the magnitude (length) of this vector
     */
    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

// Type definition for Becsy serialization
export const vectorType = Type.vector(Type.float64, ["x", "y"], Vector);