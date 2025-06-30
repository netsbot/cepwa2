import {system, System} from "@lastolivegames/becsy";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";
import {Vector} from "../lib/Vector.ts";
import {HuntingSystem} from "./HuntingSystem.ts";
import {GrazingSystem} from "./GrazingSystem.ts";
import {RNG} from "../lib/RNG.ts";

/**
 * System for random wandering behavior
 * Runs before hunting and grazing to allow those systems to override targets
 */
@system(s => s.before(HuntingSystem, GrazingSystem))
export class WanderSystem extends System {
    // Query all entities that can wander
    private allAnimalsQuery = this.query(q => 
        q.current.with(Position, Energy).with(TargetPosition).write
    );
    
    // Track time to control wander frequency
    private lastWanderTime = 0;
    
    // Time between wandering in seconds
    private readonly wanderInterval = 2;

    execute() {
        let changedWanderTime = false;

        for (const entity of this.allAnimalsQuery.current) {
            // Check if it's time to change direction
            if (this.lastWanderTime + this.wanderInterval < this.time) {
                const position = entity.read(Position).value;
                
                // Generate random offset for wandering
                const wanderOffset = [
                    RNG.nextInt(-100, 100), 
                    RNG.nextInt(-100, 100)
                ];
                
                // Set new target position
                entity.write(TargetPosition).value = new Vector(
                    position.x + wanderOffset[0], 
                    position.y + wanderOffset[1]
                );
                
                changedWanderTime = true;
            }
        }

        // Update wander time if any entities changed direction
        if (changedWanderTime) {
            this.lastWanderTime = this.time;
        }
    }
}