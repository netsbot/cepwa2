import {Entity, System, system} from "@lastolivegames/becsy";
import {Predator} from "../components/Predator.ts";
import {Deer} from "../animals/Deer.ts";
import {Wolf} from "../animals/Wolf.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {Prey} from "../components/Prey.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";

@system
export class HuntingSystem extends System {
    private readonly wolves = this.query(q => q.current.with(Wolf, Position).and.with(Predator, Velocity).write);
    private readonly deers = this.query(q => q.current.with(Deer, Position).read.and.with(Prey, Velocity).write.and.without(ToBeDeleted).write);

    private selectClosestPrey(preys: readonly Entity[], predatorPosition: any, predatorComponent: any): Entity | null {
        let closestPrey: Entity | null = null;
        let closestDistance = Infinity;
        for (const prey of preys) {
            const preyPosition = prey.read(Position);
            const distance = predatorPosition.dist(preyPosition.value);
            if (distance > predatorComponent.huntDistance || distance > closestDistance) continue;
            if (Math.random() > predatorComponent.preyDetectChance) continue;
            closestPrey = prey;
            closestDistance = distance;
        }
        return closestPrey;
    }

    private movePredatorTowards(predatorVelocity: any, predatorPosition: any, preyPosition: any, predatorSpeed: number) {
        // predatorVelocity and predatorPosition are Vector
        const direction = preyPosition.copy();
        direction.sub(predatorPosition);
        if (direction.mag() < 10) {
            predatorVelocity.mult(0);
        } else {
            direction.normalize();
            direction.mult(predatorSpeed);
            predatorVelocity.add(direction);
        }
    }

    private handlePredators(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const predator of predators) {
            const predatorComponent = predator.write(Predator);
            const predatorPosition = predator.read(Position).value.copy();
            const predatorVelocity = predator.write(Velocity).value;
            const predatorSpeed = predatorComponent.speed; // assumes Predator has a speed property

            // Choose prey if not already chosen
            if (predatorComponent.target) {
                const prey = predatorComponent.target;
                const preyPosition = prey.read(Position).value.copy();
                if (preyPosition.dist(predatorPosition) > predatorComponent.huntDistance) {
                    predatorComponent.target = null;
                    continue;
                }

                // Move towards the prey
                this.movePredatorTowards(predatorVelocity, predatorPosition, preyPosition, predatorSpeed);

            } else {
                const closestPrey = this.selectClosestPrey(preys, predatorPosition, predatorComponent);
                if (closestPrey) {
                    predatorComponent.target = closestPrey;
                }
            }
        }
    }

    private selectClosestPredator(predators: readonly Entity[], preyPosition: any, preyComponent: any): Entity | null {
        let closestPredator: Entity | null = null;
        let closestDistance = Infinity;
        for (const predator of predators) {
            const predatorPosition = predator.read(Position);
            const distance = preyPosition.dist(predatorPosition.value);
            if (distance > preyComponent.fleeDistance || distance > closestDistance) continue;
            closestPredator = predator;
            closestDistance = distance;
        }
        return closestPredator;
    }

    private movePreyAway(preyVelocity: any, preyPosition: any, predatorPosition: any, prey: Entity) {
        const direction = predatorPosition.copy();
        direction.sub(preyPosition);
        if (direction.mag() < 10) {
            prey.add(ToBeDeleted);
        } else {
            preyVelocity.value.sub(direction);
        }
    }

    private handlePreys(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const prey of preys) {
            const preyComponent = prey.write(Prey);
            const preyPosition = prey.read(Position).value.copy();
            const preyVelocity = prey.write(Velocity);

            if (preyComponent.target) {
                const predator = preyComponent.target;
                const predatorPosition = predator.read(Position).value.copy();
                if (predatorPosition.dist(preyPosition) > preyComponent.fleeDistance) {
                    preyComponent.target = null;
                    continue;
                }

                // Move away from the predator
                this.movePreyAway(preyVelocity, preyPosition, predatorPosition, prey);
            } else {
                const closestPredator = this.selectClosestPredator(predators, preyPosition, preyComponent);
                if (closestPredator) {
                    preyComponent.target = closestPredator;
                }
            }
        }
    }

    execute(): void {
        this.handlePredators(this.wolves.current, this.deers.current);
        this.handlePreys(this.wolves.current, this.deers.current);
    }
}