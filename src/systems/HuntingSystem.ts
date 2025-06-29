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

@system
export class HuntingSystem extends System {
    private relationships = new Map<ComponentType<any>, ComponentType<any>[]>(
        [
            [Wolf, [Pig, Chick]],
            [Pig, [Chick]]
        ]
    );

    private queries: [Query, Query][] = this.generateQueries(this.relationships);

    private generateQueries(relationships: Map<ComponentType<any>, ComponentType<any>[]>): [Query, Query][] {
        let queries: [Query, Query][] = [];

        for (const [predator, preys] of relationships.entries()) {
            const predatorQuery = this.createPredatorQuery(predator);
            const preyQuery = this.createPreyQuery(preys);

            queries.push([predatorQuery, preyQuery]);
        }
        return queries;
    }

    private createPredatorQuery(component: ComponentType<any>) {
        return this.query(q => q.current.with(Position, component, Predator, TargetPosition, Energy).write.and.without(ToBeDeleted).write);
    }

    private createPreyQuery(components: ComponentType<any>[]) {
        return this.query(q => q.current.with(Position).and.with(Prey).update.and.withAny(...components));
    }

    private handleHunting(predators: readonly Entity[], preys: readonly Entity[]): void {
        for (const predator of predators) {
            const predatorEnergy = predator.write(Energy);
            const predatorComponent = predator.write(Predator);


            if (predatorEnergy.value < predatorEnergy.startingValue) {
                const predatorPos = predator.write(Position).value;

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
                    predatorComponent.target = closestPrey; // Set the target prey for the predator
                    predator.write(TargetPosition).value = closestPrey.read(Position).value;

                    const distanceToPrey = predatorPos.dist(closestPrey.read(Position).value);

                    if (distanceToPrey < 5) {
                        closestPrey.add(ToBeDeleted); // Remove the prey entity

                        predatorEnergy.value += closestPrey.read(Prey).energyValue; // Gain energy from the prey

                    }
                }
            }
        }
    }

    execute(): void {
        for (const [predatorQuery, preyQuery] of this.queries) {
            this.handleHunting(predatorQuery.current, preyQuery.current);
        }
    }
}