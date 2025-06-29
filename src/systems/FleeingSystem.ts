import {System, system} from "@lastolivegames/becsy";
import {HuntingSystem} from "./HuntingSystem.ts";
import {Position} from "../components/Position.ts";
import {Prey} from "../components/Prey.ts";
import {Vector} from "../lib/Vector.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {GrazingSystem} from "./GrazingSystem.ts";

@system(s => s.after(HuntingSystem, GrazingSystem))
export class FleeingSystem extends System {
    private readonly preys = this.query(q => q.current.with(Position, Prey).and.with(TargetPosition).write);

    execute() {
        for (const prey of this.preys.current) {
            const preyComponent = prey.read(Prey);

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
}