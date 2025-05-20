import p5 from "p5";
import {IPredator} from "./predatorBehavior.ts";
import {detectPredators, flee} from "./behaviors.ts";

export interface IPrey {
    detectPredators(predators: IPredator[]): IPredator[];
    flee(predators: IPredator[]): p5.Vector;
    die(): void;
    get position(): p5.Vector;
}

export class PreyBehavior {
    private animal: any;
    private _fleeDistance: number;
    private _predatorDetectChance: number;
    private _velocity: p5.Vector;
    private _detectedPredators: IPredator[] = [];
    private _isFleeing: boolean = false;

    constructor(animal: any, options: {fleeDistance: number, predatorDetectChance: number, velocity: p5.Vector}) {
        this.animal = animal;
        this._fleeDistance = options.fleeDistance;
        this._predatorDetectChance = options.predatorDetectChance;
        this._velocity = options.velocity;
    }

    detectPredators(predators: IPredator[]): IPredator[] {
        return detectPredators(
            this.animal.position,
            predators,
            this._fleeDistance,
            this._predatorDetectChance
        );
    }

    flee(predators: IPredator[]): p5.Vector {
        return flee(this.animal.position, predators);
    }

    update(predators: IPredator[]) {
        this._detectedPredators = this._detectedPredators.filter(p => predators.includes(p));
        const newPredators = predators.filter(p => !this._detectedPredators.includes(p));
        const newlyDetected = this.detectPredators(newPredators);
        this._detectedPredators = [...this._detectedPredators, ...newlyDetected];
        this._isFleeing = this._detectedPredators.length > 0;
        if (this._isFleeing) {
            const fleeVector = this.flee(this._detectedPredators);
            this._velocity.add(fleeVector);
        }
    }
}
