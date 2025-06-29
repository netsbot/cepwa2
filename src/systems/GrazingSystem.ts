import {system, System, Query, ComponentType, Entity} from "@lastolivegames/becsy";
import {Energy} from "../components/Energy.ts";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {Prey} from "../components/Prey.ts";
import {Grass} from "../environment/Grass.ts";
import {Deer} from "../animals/Deer.ts";
import {Vegetation} from "../components/Vegetation.ts";
import {HuntingSystem} from "./HuntingSystem.ts";

@system(s => s.after(HuntingSystem))
export class GrazingSystem extends System {
    private relationships = new Map<ComponentType<any>, ComponentType<any>[]>(
        [
            [Deer, [Grass]],
        ]
    );

    private queries: [Query, Query][] = this.generateQueries(this.relationships);

    private generateQueries(relationships: Map<ComponentType<any>, ComponentType<any>[]>): [Query, Query][] {
        let queries: [Query, Query][] = [];

        for (const [prey, vegetation] of relationships.entries()) {
            const preyQuery = this.createPreyQuery(prey);
            const vegetationQuery = this.createVegetationQuery(vegetation);

            queries.push([preyQuery, vegetationQuery]);
        }
        return queries;
    }

    private createPreyQuery(component: ComponentType<any>) {
        return this.query(q => q.current.with(Position, component, Prey, TargetPosition, Energy).write.and.without(ToBeDeleted).write);
    }

    private createVegetationQuery(components: ComponentType<any>[]) {
        return this.query(q => q.current.with(Position).and.with(Vegetation).update.and.withAny(...components));
    }

    private handleGrazing(preys: readonly Entity[], vegetation: readonly Entity[]): void {
        for (const prey of preys) {
            const preyEnergy = prey.write(Energy);
            const preyComponent = prey.write(Prey);

            if (preyEnergy.value < preyEnergy.startingValue) {
                const preyPos = prey.write(Position).value;

                let closestVegetation: Entity | null = null;
                let closestDist = Infinity;

                for (const veg of vegetation) {
                    const vegPos = veg.read(Position).value;
                    const dist = preyPos.dist(vegPos);
                    if (dist < closestDist && dist < preyComponent.grazingDistance) {
                        closestDist = dist;
                        closestVegetation = veg;
                    }
                }

                if (closestVegetation) {
                    prey.write(TargetPosition).value = closestVegetation.read(Position).value;

                    const distanceToTarget = preyPos.dist(closestVegetation.read(Position).value);

                    if (distanceToTarget < 5) {
                        try {
                            closestVegetation.add(ToBeDeleted);
                        } catch (e) {
                            return;
                        }
                        preyEnergy.value += closestVegetation.read(Vegetation).energyValue;
                    }
                }
            }
        }
    }

    execute(): void {
        for (const [preyQuery, vegetationQuery] of this.queries) {
            this.handleGrazing(preyQuery.current, vegetationQuery.current);
        }
    }
}