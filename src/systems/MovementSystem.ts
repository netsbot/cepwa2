import {System, system} from "@lastolivegames/becsy";
import {Velocity} from "../components/Velocity.ts";
import {Position} from "../components/Position.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Acceleration} from "../components/Acceleration.ts";
import {Energy} from "../components/Energy.ts";
import {Vector} from "../lib/Vector.ts";

@system(s => s.afterWritersOf(Position, TargetPosition)) export class MovementSystem extends System{
    private targetPositionEntities = this.query(
        q => q.current.with(Acceleration, Position).and.with(Velocity, TargetPosition).write
    )

    private entitiesWithMaxSpeed = this.query(q => q.current.with(MaxSpeed).with(Position, Velocity, Energy).write);

    private entitiesWithoutMaxSpeed = this.query(q => q.current.without(MaxSpeed).and.with(Velocity).and.with(Position).write);

    execute() {
        for (const entity of this.targetPositionEntities.current) {
            const targetPosition = entity.write(TargetPosition);

            if (isNaN(targetPosition.value.x)) continue;

            let velocity = entity.write(Velocity);
            const acceleration = entity.read(Acceleration).value;
            const position = entity.read(Position).value;

            const direction= targetPosition.value.copy();
            direction.sub(position);

            if (direction.mag() < 5) {
                velocity.value.multScalar(0);
            } else {
                targetPosition.speed += acceleration;
                direction.normalize();
                direction.multScalar(targetPosition.speed);

                velocity.value = direction;
            }

            // Reset target position if close enough

            if (targetPosition.value.dist(position) < 5) {
                targetPosition.value = new Vector(NaN, NaN);
                targetPosition.speed = 0;
            }
        }

        for (const entity of this.entitiesWithMaxSpeed.current) {
            const velocity = entity.write(Velocity).value;
            const maxSpeed = entity.read(MaxSpeed).value;
            const position = entity.write(Position).value;
            let energy = entity.write(Energy);

            energy.value -= energy.lossPerMovement;

            if (energy.value <= 0) {
                energy.value = 0.1; // Prevents energy from going to zero
            }

            velocity.limit(maxSpeed);
            velocity.multScalar(this.delta)
            velocity.multScalar(energy.value / energy.startingValue);


            position.add(velocity);
        }

        for (const entity of this.entitiesWithoutMaxSpeed.current) {
            const velocity = entity.read(Velocity);
            const position = entity.write(Position);

            position.value.add(velocity.value);
        }
    }
}