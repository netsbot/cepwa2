import {system, System} from "@lastolivegames/becsy";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";
import {Vector} from "../lib/Vector.ts";
import {HuntingSystem} from "./HuntingSystem.ts";
import {GrazingSystem} from "./GrazingSystem.ts";
import {RNG} from "../lib/RNG.ts";

@system(s => s.before(HuntingSystem, GrazingSystem))
export class WanderSystem extends System {
    private allAnimalsQuery = this.query(q => q.current.with(Position, Energy).with(TargetPosition).write);
    private lastWanderTime = 0;

    execute() {
        let changedWanderTime = false;

        for (const entity of this.allAnimalsQuery.current) {
            if (entity.read(Energy).value < entity.read(Energy).startingValue)
                continue;

            if (this.lastWanderTime + 2 < this.time) {
                const position = entity.read(Position).value;
                const wanderOffset = [RNG.nextInt(-100, 100), RNG.nextInt(-100, 100)];
                entity.write(TargetPosition).value = new Vector(position.x + wanderOffset[0], position.y + wanderOffset[1]);
                changedWanderTime = true;
            }
        }

        if (changedWanderTime) {
            this.lastWanderTime = this.time;
        }
    }
}