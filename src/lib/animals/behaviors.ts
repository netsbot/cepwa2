import p5 from "p5";
import Prey from "./prey.ts";
import Predator from "./predator.ts";

// Prey behaviors
export function detectPredators(position: p5.Vector, predators: Predator[], fleeDistance: number, predatorDetectChance: number): Predator[] {
    let detected: Predator[] = [];
    for (let predator of predators) {
        if (position.dist(predator.position) < fleeDistance) {
            if (Math.random() < predatorDetectChance) {
                detected.push(predator);
            }
        }
    }
    return detected;
}

export function flee(position: p5.Vector, predators: Predator[]): p5.Vector {
    let direction = new p5.Vector(0, 0);
    for (let predator of predators) {
        let away = p5.Vector.sub(position, predator.position);
        away.normalize();
        direction.add(away);
    }
    if (predators.length > 0) direction.div(predators.length);
    return direction;
}

// Predator behaviors
export function detectPrey(position: p5.Vector, preys: Prey[], huntDistance: number, preyDetectChance: number): Prey | null {
    let detected: Prey | null = null;
    let closest = Infinity;
    for (let prey of preys) {
        let dist = position.dist(prey.position);
        if (dist < huntDistance && dist < closest) {
            if (Math.random() < preyDetectChance) {
                detected = prey;
                closest = dist;
            }
        }
    }
    return detected;
}

export function hunt(position: p5.Vector, prey: Prey): p5.Vector {
    let direction = p5.Vector.sub(prey.position, position);
    direction.normalize();
    return direction;
}