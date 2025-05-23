import {ComponentType, Entity, Query, System, system} from "@lastolivegames/becsy";

import {Predator} from "../components/Predator.ts";
import {Prey} from "../components/Prey.ts";

import {Position} from "../components/Position.ts";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {TargetPosition} from "../components/TargetPosition.ts";

import {Deer} from "../animals/Deer.ts";
import {Wolf} from "../animals/Wolf.ts";
import {Lion} from "../animals/Lion.ts";


@system
export class PredatorSystem extends System {
    private relationships = new Map<ComponentType<any>, ComponentType<any>[]>(
        [
            [Lion, [Wolf, Deer]],
            [Wolf, [Deer]]
        ]
    )

    private queries: [Query, Query][] = this.generateQueries(this.relationships)

    private generateQueries(relationships: Map<ComponentType<any>, ComponentType<any>[]>): [Query, Query][] {
        let queries: [Query, Query][] = [];

        for (const [predator, preys] of relationships.entries()) {
            const predatorQuery = this.createPredatorQuery(predator);
            const preyQuery = this.createPreyQuery(preys);

            queries.push([predatorQuery, preyQuery]);
        }
        return queries;
    }

    private createPredatorQuery(components: ComponentType<any>) {
        return this.query(q => q.current.with(Position, components).and.with(Predator, TargetPosition).write.and.without(ToBeDeleted).write);
    }

    private createPreyQuery(components: ComponentType<any>[]) {
        return this.query(q => q.current.with(Position).and.with(Prey).update.and.withAny(...components));
    }

    private handlePredators(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const predator of predators) {
            const predatorComponent = predator.write(Predator);

            if (!predatorComponent.hunting) continue;

            const predatorPosition = predator.read(Position).value.copy();

            // Recalculate preys every second

            if (Math.round(this.time * 100) % 20 === 0) {
                let closestDistance = Infinity;

                for (const prey of preys) {
                    const preyPosition = prey.read(Position);
                    const distance = preyPosition.value.dist(predatorPosition)

                    if (distance > predatorComponent.huntDistance || distance > closestDistance)
                        continue;

                    predatorComponent.target = prey;
                    closestDistance = distance;
                }
            }

            if (predatorComponent.target) {

                const preyPosition = predatorComponent.target.read(Position).value.copy();
                const preyDistance = preyPosition.dist(predatorPosition);
                if (preyDistance > predatorComponent.huntDistance) {
                    predatorComponent.target = null;
                    continue;
                }

                // Move towards the prey
                predator.write(TargetPosition).value = preyPosition;

                if (preyDistance < 5) {
                    // Sometimes the prey already has ToBeDeleted component

                    try {
                        predatorComponent.target.add(ToBeDeleted);
                    } catch (e) {
                    }
                }
            }
        }
    }

    execute(): void {
        for (const [predatorQuery, preyQuery] of this.queries) {
            const predators = predatorQuery.current;
            const preys = preyQuery.current;

            this.handlePredators(predators, preys);
        }
    }
}