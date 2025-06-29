import {system, System} from "@lastolivegames/becsy";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {FleeingSystem} from "./FleeingSystem.ts";
import {HuntingSystem} from "./HuntingSystem.ts";

/**
 * System for removing entities marked for deletion
 * Runs after other systems have finished processing
 */
@system(s => s.after(FleeingSystem, HuntingSystem)) 
export class DeleterSystem extends System {
    // Query all entities marked for deletion
    private entities = this.query(q => q.current.with(ToBeDeleted).usingAll.write);

    execute() {
        // Remove each entity from the world
        for (const entity of this.entities.current) {
            entity.delete();
        }
    }
}