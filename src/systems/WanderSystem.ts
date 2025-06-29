import {system, System} from "@lastolivegames/becsy";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";
import {Vector} from "../lib/Vector.ts";
import {HuntingSystem} from "./HuntingSystem.ts";
import {GrazingSystem} from "./GrazingSystem.ts";

@system(s => s.before(HuntingSystem, GrazingSystem))
export class WanderSystem extends System {
    private allAnimalsQuery = this.query(q => q.current.with(Position, Energy).with(TargetPosition).write);

    execute() {
        for (const entity of this.allAnimalsQuery.current) {
            if (entity.read(Energy).value < entity.read(Energy).startingValue * 0.3)
                continue;

            if (isNaN(entity.read(TargetPosition).value.x)) {
                const position = entity.read(Position).value;
                const wanderOffset = [(Math.round(Math.random()) * 2 - 1) * 100, (Math.round(Math.random()) * 2 - 1) * 100];
                entity.write(TargetPosition).value = new Vector(position.x + wanderOffset[0], position.y + wanderOffset[1]);
            }
        }
    }
}