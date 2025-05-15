import p5 from "p5";
import Animal, {IAnimalUpdateProp} from "./animal.ts";
import Predator from "./predator.ts";
import {detectPredators, flee} from "./behaviors.ts";

export interface IPrey {
    detectPredators(predators: Predator[]): Predator[];

    flee(predators: Predator[]): p5.Vector;
}

export interface IPreyUpdateProp extends IAnimalUpdateProp {
    availablePredators?: Predator[];
}

export default abstract class Prey extends Animal implements IPrey {
    protected abstract _fleeDistance: number;
    protected abstract _isFleeing: boolean;
    protected abstract _detectedPredators: Predator[];
    protected abstract _predatorDetectChance: number;
    static predatorChoices: (typeof Predator)[];

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

    update(props?: IPreyUpdateProp): void {
        if (props) {
            super.update(props);

            if (props.availablePredators) {
                // Detect nearby predators

                const detected = this.detectPredators(props.availablePredators);
                this._detectedPredators = detected;
                this._isFleeing = detected.length > 0;

            }
        }

        // If fleeing, move away from detected predators
        if (this._isFleeing && this._detectedPredators.length > 0) {
            const fleeVector = this.flee(this._detectedPredators);
            this._velocity.add(fleeVector);
        }

        // check if the prey is dead
        if (this._detectedPredators.length > 0) {
            for (let predator of this._detectedPredators) {
                const distance = p5.Vector.dist(this.position, predator.position);
                if (distance < predator.maxSpeed) { // 5 can be replaced with a configurable catch distance
                    this.die();
                }
            }
        }

        this._velocity.limit(this._maxSpeed);
        this._position = this._position.add(this._velocity);
    }
}
