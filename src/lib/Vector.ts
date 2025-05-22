import {Type} from "@lastolivegames/becsy";

export class Vector {
    x: number = 0;
    y: number = 0;

    add(that: Vector): void {
        this.x += that.x;
        this.y += that.y;
    }

    addScalar(scalar: number): void {
        this.x += scalar;
        this.y += scalar;
    }

    sub(that: Vector): void {
        this.x -= that.x;
        this.y -= that.y;
    }

    multScalar(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    mult(that: Vector): void {
        this.x *= that.x;
        this.y *= that.y;
    }

    div(scalar: number): void {
        this.x /= scalar;
        this.y /= scalar;
    }

    limit(max: number): void {
        const length = this.mag();
        if (length > max) {
            this.normalize();
            this.multScalar(max);
        }
    }

    dist(that: Vector): number {
        const dx = this.x - that.x;
        const dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    copy(): Vector {
        const copy = new Vector();
        copy.x = this.x;
        copy.y = this.y;
        return copy;
    }

    normalize(): void {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length > 0) {
            this.div(length);
        }
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMag(magnitude: number): void {
        const length = this.mag();
        if (length > 0) {
            this.div(length);
            this.multScalar(magnitude);
        } else {
            this.x = magnitude;
            this.y = 0;
        }
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

export const vectorType = Type.vector(Type.float64, ["x", "y"], Vector);