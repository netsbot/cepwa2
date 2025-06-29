import {system, System, Query, ComponentType, Entity} from "@lastolivegames/becsy";
import {Energy} from "../components/Energy.ts";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {Prey} from "../components/Prey.ts";
import {Grass} from "../environment/Grass.ts";
import {Chick} from "../animals/Chick.ts";
import {Vegetation} from "../components/Vegetation.ts";
import {HuntingSystem} from "./HuntingSystem.ts";

/**
 * System for prey grazing behavior
 */
@system(s => s.after(HuntingSystem))
export class GrazingSystem extends System {
    // Define which entities can eat what vegetation
    private relationships = new Map<ComponentType<any>, ComponentType<any>[]>(
        [
            [Chick, [Grass]], // Chicks eat grass
        ]
    );

    // Generate queries for each grazer-vegetation relationship
    private queries: [Query, Query][] = this.generateQueries(this.relationships);

    /**
     * Generate ECS queries for each grazer-vegetation relationship
     */
    private generateQueries(relationships: Map<ComponentType<any>, ComponentType<any>[]>): [Query, Query][] {
        let queries: [Query, Query][] = [];

        for (const [prey, vegetation] of relationships.entries()) {
            const preyQuery = this.createPreyQuery(prey);
            const vegetationQuery = this.createVegetationQuery(vegetation);

            queries.push([preyQuery, vegetationQuery]);
        }
        return queries;
    }

    /**
     * Create a query to find prey that can graze
     */
    private createPreyQuery(component: ComponentType<any>) {
        return this.query(q => q.current
            .with(Position, component, Prey, TargetPosition, Energy).write
            .and.without(ToBeDeleted).write);
    }

    /**
     * Create a query to find vegetation that can be consumed
     */
    private createVegetationQuery(components: ComponentType<any>[]) {
        return this.query(q => q.current
            .with(Position)
            .and.with(Vegetation).update
            .and.withAny(...components));
    }

    /**
     * Process grazing behavior for prey entities
     */
    private handleGrazing(preys: readonly Entity[], vegetation: readonly Entity[]): void {
        for (const prey of preys) {
            const preyEnergy = prey.write(Energy);
            const preyComponent = prey.write(Prey);

            // Only look for food when prey needs energy
            if (preyEnergy.value < preyEnergy.startingValue) {
                const preyPos = prey.write(Position).value;

                // Find closest vegetation within grazing distance
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
                    // Move toward the vegetation
                    prey.write(TargetPosition).value = closestVegetation.read(Position).value;

                    const distanceToTarget = preyPos.dist(closestVegetation.read(Position).value);

                    // Consume vegetation if close enough
                    if (distanceToTarget < 5) {
                        try {
                            // Mark vegetation for deletion
                            closestVegetation.add(ToBeDeleted);
                        } catch (e) {
                            return;
                        }
                        // Gain energy from consuming vegetation
                        preyEnergy.value += closestVegetation.read(Vegetation).energyValue;
                    }
                }
            }
        }
    }

    execute(): void {
        // Process all grazing relationships
        for (const [preyQuery, vegetationQuery] of this.queries) {
            this.handleGrazing(preyQuery.current, vegetationQuery.current);
        }
    }
}