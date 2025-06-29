import {System, system} from "@lastolivegames/becsy";
import {Energy} from "../components/Energy.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";

@system export class EnergySystem extends System {
    private energyQuery = this.query(q => q.current.with(Energy));

    execute() {
        for (const entity of this.energyQuery.current) {
            const energy = entity.read(Energy);
            if (energy.value <= 0.05) {
                entity.add(ToBeDeleted);
            }
        }
    }
}