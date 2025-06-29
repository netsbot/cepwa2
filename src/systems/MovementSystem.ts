import {System, system} from "@lastolivegames/becsy";
import {Velocity} from "../components/Velocity.ts";
import {Position} from "../components/Position.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Acceleration} from "../components/Acceleration.ts";
import {Energy} from "../components/Energy.ts";

@system(s => s.afterWritersOf(Position, TargetPosition)) 
export class MovementSystem extends System {
    // Query for entities that need to move toward a target
    private targetPositionEntities = this.query(
        q => q.current.with(Acceleration, Position).and.with(Velocity, TargetPosition).write
    )

    // Query for entities with speed limits and energy consumption
    private entitiesWithMaxSpeed = this.query(
        q => q.current.with(MaxSpeed).with(Position, Velocity, Energy).write
    );

    // Query for entities without speed limits
    private entitiesWithoutMaxSpeed = this.query(
        q => q.current.without(MaxSpeed).and.with(Velocity).and.with(Position).write
    );

    execute() {
        this.handleTargetPositionEntities();
        this.handleEntitiesWithMaxSpeed();
        this.handleEntitiesWithoutMaxSpeed();
    }

    private handleTargetPositionEntities() {
        for (const entity of this.targetPositionEntities.current) {
            const targetPosition = entity.write(TargetPosition);

            // Skip if target is not set
            if (isNaN(targetPosition.value.x)) continue;

            let velocity = entity.write(Velocity);
            const acceleration = entity.read(Acceleration).value;
            const position = entity.read(Position).value;

            // Calculate direction vector toward target
            const direction = targetPosition.value.copy();
            direction.sub(position);

            // If close enough to target, stop moving
            if (direction.mag() < 5) {
                velocity.value.multScalar(0);
            } else {
                // Accelerate toward target
                targetPosition.speed += acceleration;
                direction.normalize();
                direction.multScalar(targetPosition.speed);
                velocity.value = direction;
            }
        }
    }

    private handleEntitiesWithMaxSpeed() {
        for (const entity of this.entitiesWithMaxSpeed.current) {
            const velocity = entity.write(Velocity).value;
            const maxSpeed = entity.read(MaxSpeed).value;
            const position = entity.write(Position).value;
            let energy = entity.write(Energy);

            // Apply energy cost for movement
            energy.value -= energy.lossPerMovement;
            if (energy.value <= 0) {
                energy.value = 0.1; // Minimum energy level
            }

            // Apply speed limit
            velocity.limit(maxSpeed);
            
            // Scale velocity by delta time and available energy
            velocity.multScalar(this.delta);
            velocity.multScalar(energy.value / energy.startingValue);

            // Update position
            position.add(velocity);
        }
    }

    private handleEntitiesWithoutMaxSpeed() {
        for (const entity of this.entitiesWithoutMaxSpeed.current) {
            const velocity = entity.read(Velocity);
            const position = entity.write(Position);

            // Simple position update
            position.value.add(velocity.value);
        }
    }
}