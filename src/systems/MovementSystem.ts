import {System, system} from "@lastolivegames/becsy";
import {Velocity} from "../components/Velocity.ts";
import {Position} from "../components/Position.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {DeleterSystem} from "./DeleterSystem.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Acceleration} from "../components/Acceleration.ts";

@system(s => s.after(DeleterSystem)) export class MovementSystem extends System{
    private targetPositionEntities = this.query(
        q => q.current.with(Acceleration, Position).and.with(Velocity, TargetPosition).write
    )

    private entitiesWithMaxSpeed = this.query(q => q.current.with(MaxSpeed).with(Position, Velocity).write);

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
        }

        for (const entity of this.entitiesWithMaxSpeed.current) {
            const velocity = entity.write(Velocity).value;
            const maxSpeed = entity.read(MaxSpeed).value;
            const position = entity.write(Position).value;

            velocity.limit(maxSpeed);
            velocity.multScalar(this.delta)


            position.add(velocity);
        }

        for (const entity of this.entitiesWithoutMaxSpeed.current) {
            const velocity = entity.read(Velocity);
            const position = entity.write(Position);

            position.value.add(velocity.value);
        }
    }
}