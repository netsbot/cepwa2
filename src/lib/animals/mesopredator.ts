import p5 from "p5";
import {IPredator} from "./predator.ts";
import {IPrey} from "./prey.ts";
import Animal, {IAnimalUpdateProp} from "./animal.ts";
import {detectPrey, hunt, detectPredators, flee} from "./behaviors.ts";
import Prey from "./prey.ts";
import Predator from "./predator.ts";

interface IMesopredatorUpdateProp extends IAnimalUpdateProp {
    availablePreys: Prey[];
    nearbyPredators: Predator[];
}

export default abstract class Mesopredator extends Animal implements IPredator, IPrey {
    protected abstract _huntDistance: number;
    protected abstract _isHunting: boolean;
    protected abstract _chosenPrey: Prey | null;
    protected abstract _preyDetectChance: number;
    protected abstract _preyChoices: (typeof Prey)[];

    protected abstract _fleeDistance: number;
    protected abstract _isFleeing: boolean;
    protected abstract _detectedPredators: Predator[];
    protected abstract _predatorDetectChance: number;
    protected abstract _predatorChoices: (typeof Predator)[];

    detectPredators(predators: Predator[]): Predator[] {
        return detectPredators(
            this.position,
            predators,
            this._fleeDistance,
            this._predatorDetectChance
        );
    }

    flee(predators: Predator[]): p5.Vector {
        return flee(this.position, predators);
    }

    detectPrey(preys: Prey[]): Prey | null {
        return detectPrey(
            this.position,
            preys,
            this._huntDistance,
            this._preyDetectChance
        );
    }

    hunt(prey: Prey): p5.Vector {
        return hunt(this.position, prey);
    }

    update(props?: IMesopredatorUpdateProp): void {
        super.update(props);
    }

    get preyChoices(): (typeof Prey)[] {
        return this._preyChoices;
    }

    get predatorChoices(): (typeof Predator)[] {
        return this._predatorChoices;
    }
}