import {System, system} from "@lastolivegames/becsy";
import {Velocity} from "../components/Velocity.ts";
import {Position} from "../components/Position.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {DeleterSystem} from "./DeleterSystem.ts";

@system(s => s.after(DeleterSystem)) export class MovementSystem extends System{
    private entities = this.query(
        q => q.current.with(Velocity, MaxSpeed).and.with(Position).write
    )

    private entitiesWithoutMaxSpeed = this.query(q => q.current.without(MaxSpeed).and.with(Velocity).and.with(Position).write);

    execute() {
        for (const entity of this.entities.current) {
            const velocity = entity.read(Velocity).value.copy();
            const maxSpeed = entity.read(MaxSpeed).value;
            const position = entity.write(Position);

            velocity.limit(maxSpeed);

            position.value.add(velocity);
        }

        for (const entity of this.entitiesWithoutMaxSpeed.current) {
            const velocity = entity.read(Velocity);
            const position = entity.write(Position);

            position.value.add(velocity.value);
        }
    }
}