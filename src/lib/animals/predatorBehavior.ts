import p5 from "p5";
import {IPrey} from "./preyBehavior.ts";
import {detectPrey, hunt} from "./behaviors.ts";

export interface IPredator {
    detectPrey(preys: IPrey[]): IPrey | null;
    hunt(prey: IPrey): p5.Vector;
}

export class PredatorBehavior {
    private animal: any;
    private _huntDistance: number;
    private _preyDetectChance: number;
    private _maxSpeed: number;
    private _velocity: p5.Vector;
    private _chosenPrey: IPrey | null = null;
    private _isHunting: boolean = false;

    constructor(animal: any, options: {huntDistance: number, preyDetectChance: number, maxSpeed: number, velocity: p5.Vector}) {
        this.animal = animal;
        this._huntDistance = options.huntDistance;
        this._preyDetectChance = options.preyDetectChance;
        this._maxSpeed = options.maxSpeed;
        this._velocity = options.velocity;
    }

    detectPrey(preys: IPrey[]): IPrey | null {
        return detectPrey(
            this.animal.position,
            preys,
            this._huntDistance,
            this._preyDetectChance
        );
    }

    hunt(prey: IPrey): p5.Vector {
        return hunt(this.animal.position, prey);
    }

    update(preys: IPrey[]) {
        if (this._isHunting && this._chosenPrey && !preys.includes(this._chosenPrey)) {
            this._isHunting = false;
            this._chosenPrey = null;
        }
        if (!this._isHunting) {
            const prey = this.detectPrey(preys);
            if (prey) {
                this._chosenPrey = prey;
                this._isHunting = true;
            }
        }
        if (this._isHunting && this._chosenPrey) {
            const huntVector = this.hunt(this._chosenPrey);
            this._velocity.add(huntVector);
            const distance = p5.Vector.dist(this.animal.position, this._chosenPrey.position);
            if (distance < this._maxSpeed + 10) {
                this._chosenPrey.die();
                this._isHunting = false;
                this._chosenPrey = null;
            }
        }
    }
}
