import {System, system} from "@lastolivegames/becsy";
import {Energy} from "../components/Energy.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {MovementSystem} from "./MovementSystem.ts";

/**
 * System for managing entity energy levels
 */
@system(s => s.after(MovementSystem)) export class EnergySystem extends System {
    // Query all entities with energy
    private energyQuery = this.query(q => q.current.with(Energy).with(ToBeDeleted).write);

    // Minimum energy threshold before death
    private readonly minimumEnergyLevel = 0.05;

    execute() {
        for (const entity of this.energyQuery.current) {
            const energy = entity.read(Energy);
            
            // Mark entity for deletion if energy is too low
            if (energy.value <= this.minimumEnergyLevel) {
                try {
                    entity.add(ToBeDeleted);
                } catch (e) {
                }
            }
        }
    }
}