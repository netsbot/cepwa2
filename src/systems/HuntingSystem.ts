import {system, System, Query, ComponentType, Entity} from "@lastolivegames/becsy";
import {Predator} from "../components/Predator.ts";
import {Energy} from "../components/Energy.ts";
import {Position} from "../components/Position.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {Prey} from "../components/Prey.ts";
import {Pig} from "../animals/Pig.ts";
import {Chick} from "../animals/Chick.ts";
import {Wolf} from "../animals/Wolf.ts";

/**
 * System for predator hunting behavior
 */
@system
export class HuntingSystem extends System {
    // Define predator-prey relationships
    private relationships = new Map<ComponentType<any>, ComponentType<any>[]>(
        [
            [Wolf, [Pig, Chick]],  // Wolves hunt pigs and chicks
            [Pig, [Chick]]         // Pigs hunt chicks
        ]
    );

    // Generate queries for each predator-prey relationship
    private queries: [Query, Query][] = this.generateQueries(this.relationships);

    /**
     * Generate ECS queries for each predator-prey relationship
     */
    private generateQueries(relationships: Map<ComponentType<any>, ComponentType<any>[]>): [Query, Query][] {
        let queries: [Query, Query][] = [];

        for (const [predator, preys] of relationships.entries()) {
            const predatorQuery = this.createPredatorQuery(predator);
            const preyQuery = this.createPreyQuery(preys);

            queries.push([predatorQuery, preyQuery]);
        }
        return queries;
    }

    /**
     * Create a query to find predators of a specific type
     */
    private createPredatorQuery(component: ComponentType<any>) {
        return this.query(q => q.current
            .with(Position, component, Predator, TargetPosition, Energy).write
            .and.without(ToBeDeleted).write);
    }

    /**
     * Create a query to find prey of specific types
     */
    private createPreyQuery(components: ComponentType<any>[]) {
        return this.query(q => q.current
            .with(Position)
            .and.with(Prey).update
            .and.withAny(...components));
    }

    /**
     * Process hunting behavior for a group of predators and potential prey
     */
    private handleHunting(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const predator of predators) {
            const predatorEnergy = predator.write(Energy);
            const predatorComponent = predator.write(Predator);

            // Only hunt when predator needs energy
            if (predatorEnergy.value < predatorEnergy.startingValue) {
                const predatorPos = predator.write(Position).value;

                // Find closest prey within hunting distance
                let closestPrey: Entity | null = null;
                let closestDist = Infinity;

                for (const prey of preys) {
                    const preyPos = prey.read(Position).value;
                    const dist = predatorPos.dist(preyPos);

                    if (dist < closestDist && dist < predatorComponent.huntDistance) {
                        closestDist = dist;
                        closestPrey = prey;
                    }
                }

                if (closestPrey) {
                    // Set target and move toward it
                    predatorComponent.target = closestPrey;
                    predator.write(TargetPosition).value = closestPrey.read(Position).value;

                    const distanceToPrey = predatorPos.dist(closestPrey.read(Position).value);

                    // Consume prey if close enough
                    if (distanceToPrey < 5) {
                        // Mark prey for deletion
                        try {
                            closestPrey.add(ToBeDeleted);
                        } catch (e) {
                            continue;
                        }


                        // Gain energy from consuming prey
                        predatorEnergy.value += closestPrey.read(Prey).energyValue;
                    }
                }
            }
        }
    }

    execute(): void {
        // Process all predator-prey relationships
        for (const [predatorQuery, preyQuery] of this.queries) {
            this.handleHunting(predatorQuery.current, preyQuery.current);
        }
    }
}