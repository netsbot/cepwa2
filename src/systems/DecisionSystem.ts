import {system, System} from "@lastolivegames/becsy";
import {Decision} from "../components/Decision.ts";
import {PredatorSystem} from "./PredatorSystem.ts";
import {Predator} from "../components/Predator.ts";
import {Reproduce} from "../components/Reproduce.ts";

@system(s => s.before(PredatorSystem))
export class DecisionSystem extends System{
    private entities = this.query(q => q.current.with(Decision, Predator, Reproduce).write);

    execute() {
        for (const entity of this.entities.current) {
            if (!entity.read(Decision).free) continue;

            const decision = entity.write(Decision);

            // Feed takes precedence over reproduce
            const random = Math.random();

            if (random < decision.feedChance) {
                try {
                    const predator = entity.write(Predator);
                    predator.hunting = true;
                    decision.free = false;
                } catch (e) {
                    // Todo prey grazing
                }
            } else if (random < decision.feedChance + decision.reproduceChance) {
                const reproduce = entity.write(Reproduce);
                reproduce.reproducing = true;
                decision.free = false
            }
        }
    }

}