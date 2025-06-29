import {System, system} from "@lastolivegames/becsy";
import {HuntingSystem} from "./HuntingSystem.ts";
import {Position} from "../components/Position.ts";
import {Prey} from "../components/Prey.ts";
import {Vector} from "../lib/Vector.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {GrazingSystem} from "./GrazingSystem.ts";

@system(s => s.after(HuntingSystem, GrazingSystem))
export class FleeingSystem extends System {
    // Query all prey entities that can flee
    private readonly preys = this.query(q => q.current.with(Position, Prey).and.with(TargetPosition).write);

    execute() {
        for (const prey of this.preys.current) {
            const preyComponent = prey.read(Prey);

            // Only process prey being hunted by predators
            if (preyComponent.huntedBy.length > 0) {
                const preyPosition = prey.read(Position).value.copy();
                let averageFleeDirection = new Vector();

                // Calculate flee direction from each nearby predator
                for (const predator of preyComponent.huntedBy) {
                    const predatorPosition = predator.read(Position);

                    // Skip predators outside of flee range
                    if (predatorPosition.value.dist(preyPosition) >= preyComponent.fleeDistance) {
                        continue;
                    }

                    // Calculate direction away from predator
                    let direction = preyPosition.copy();
                    direction.sub(predatorPosition.value);
                    averageFleeDirection.add(direction);
                }

                // Only set target position if there's a direction to flee in
                if (averageFleeDirection.mag() > 0) {
                    averageFleeDirection.normalize();
                    averageFleeDirection.multScalar(preyComponent.fleeDistance);

                    // Calculate new target position
                    preyPosition.add(averageFleeDirection);
                    prey.write(TargetPosition).value = preyPosition;
                }
            }
        }
    }
}