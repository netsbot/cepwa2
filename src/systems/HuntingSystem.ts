import {Entity, System, system} from "@lastolivegames/becsy";
import {Predator} from "../components/Predator.ts";
import {Deer} from "../animals/Deer.ts";
import {Wolf} from "../animals/Wolf.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {Prey} from "../components/Prey.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {Vector} from "../lib/Vector.ts";
import {Lion} from "../animals/Lion.ts";
import {TargetPosition} from "../components/TargetPosition.ts";

@system
export class HuntingSystem extends System {
    private readonly wolves = this.query(q => q.current.with(Wolf, Position).and.with(Predator, TargetPosition).write.and.without(ToBeDeleted).write);
    private readonly preys = this.query(q => q.current.with(Position).and.with(Prey, Velocity).write);
    private readonly deers = this.query(q => q.current.with(Deer, Position).and.with(Prey, TargetPosition).write.and.without(ToBeDeleted).write);
    private readonly lions = this.query(q => q.current.with(Lion, Position).and.with(Predator, TargetPosition).write.and.without(ToBeDeleted).write);

    private handlePredators(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const predator of predators) {
            const predatorComponent = predator.write(Predator);
            const predatorPosition = predator.read(Position).value.copy();
            const predatorVelocity = predator.write(Velocity);

            // Choose prey if not already chosen
            if (predatorComponent.target) {
                const preyPosition = predatorComponent.target.read(Position).value.copy();
                const preyDistance = preyPosition.dist(predatorPosition);
                if (preyDistance > predatorComponent.huntDistance) {
                    predatorComponent.target = null;
                    continue;
                }

                // Move towards the prey
                predator.write(TargetPosition).value = preyPosition;

                if (preyDistance < 5) {
                    predatorComponent.target.add(ToBeDeleted);
                }
            } else {
                let closestDistance = Infinity;

                for (const prey of preys) {
                    const preyPosition = prey.read(Position);
                    const distance = preyPosition.value.dist(predatorPosition)

                    if (distance > predatorComponent.huntDistance || distance > closestDistance)
                        continue;

                    if (Math.random() > predatorComponent.preyDetectChance)
                        continue;

                    predatorComponent.target = prey;
                    closestDistance = distance;
                }

                predatorVelocity.value.multScalar(0);
            }
        }
    }

    private handlePreys(preys: readonly Entity[]): void {
        for (const prey of preys) {
            const preyComponent = prey.write(Prey);

            if (preyComponent.huntedBy.length > 0) {
                const preyPosition = prey.read(Position).value.copy();

                let averageFleeDirection = new Vector();

                for (const predator of preyComponent.huntedBy) {
                    const predatorPosition = predator.read(Position);


                    if (predatorPosition.value.dist(preyPosition) >= preyComponent.fleeDistance)
                        continue;

                    let direction = preyPosition.copy()
                    direction.sub(predatorPosition.value)
                    averageFleeDirection.add(direction);

                    // if (averageFleeDirection.mag() > 0) {
                    //     averageFleeDirection.normalize();
                    // }
                }

                averageFleeDirection.normalize();
                averageFleeDirection.multScalar(preyComponent.fleeDistance);

                preyPosition.add(averageFleeDirection);

                console.log(preyPosition);

                prey.write(TargetPosition).value = preyPosition;
                // const preyVelocity = prey.write(Velocity);
                //
                // averageFleeDirection.normalize();
                // averageFleeDirection.multScalar(preyVelocity.value.mag() + preyComponent.fleeAcceleration);
                //
                // preyVelocity.value = averageFleeDirection;
            }
        }
    }

    private handleMesopredators(mesopredators: readonly Entity[], preys: readonly Entity[]): void {
        this.handlePredators(mesopredators, preys)
        this.handlePreys(mesopredators);
    }


    execute(): void {
        this.handlePredators(this.lions.current, this.wolves.current)
        this.handlePredators(this.wolves.current, this.deers.current);
        this.handlePreys(this.preys.current)
    }
}