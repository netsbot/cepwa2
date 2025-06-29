import {System, system} from "@lastolivegames/becsy";
import {Energy} from "../components/Energy.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";

/**
 * System for managing entity energy levels
 */
@system export class EnergySystem extends System {
    // Query all entities with energy
    private energyQuery = this.query(q => q.current.with(Energy));

    // Minimum energy threshold before death
    private readonly minimumEnergyLevel = 0.05;

    execute() {
        for (const entity of this.energyQuery.current) {
            const energy = entity.read(Energy);
            
            // Mark entity for deletion if energy is too low
            if (energy.value <= this.minimumEnergyLevel) {
                entity.add(ToBeDeleted);
            }
        }
    }
}