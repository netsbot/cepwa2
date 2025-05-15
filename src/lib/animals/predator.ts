import p5 from "p5";
import Animal, {IAnimalUpdateProp} from "./animal.ts";
import Prey from "./prey.ts";
import {detectPrey, hunt} from "./behaviors.ts";

interface IPredatorUpdateProp extends IAnimalUpdateProp {
    availablePreys?: Prey[];
}

export interface IPredator {
    detectPrey(preys: Prey[]): Prey | null;

    hunt(prey: Prey): p5.Vector;
}

export default abstract class Predator extends Animal implements IPredator {
    protected abstract _huntDistance: number;
    protected abstract _isHunting: boolean;
    protected abstract _chosenPrey: Prey | null;
    protected abstract _preyDetectChance: number;
    static preyChoices: (typeof Prey)[];

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

    update(props?: IPredatorUpdateProp): void {
        if (props) {
            super.update(props);

            if (props.availablePreys && !this._isHunting) {
                // If not hunting, check for available preys
                const prey = this.detectPrey(props.availablePreys);
                if (prey) {
                    this._chosenPrey = prey;
                    this._isHunting = true;
                }
            }
        }

        // If already hunting, continue hunting the chosen prey
        if (this._isHunting && this._chosenPrey) {
            const distance = p5.Vector.dist(this.position, this._chosenPrey.position);
            if (distance < this._maxSpeed) { // 5 can be replaced with a configurable catch distance
                this._isHunting = false;
                this._chosenPrey = null;
                this._velocity.setMag(0); // Stop movement to prevent overshooting
            } else {
                const huntVector = this.hunt(this._chosenPrey);
                // Limit huntVector magnitude so it doesn't overshoot the prey
                if (huntVector.mag() > distance) {
                    huntVector.setMag(distance);
                }
                this._velocity.add(huntVector);
            }
        }

        this._velocity.limit(this._maxSpeed);
        this._position = this._position.add(this._velocity);
    }
}