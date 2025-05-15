import p5 from "p5";

import Mesopredator from "../animals/mesopredator.ts";
import Prey from "../animals/prey.ts";
import Predator from "../animals/predator.ts";

export default class Wolf extends Predator {
    protected _speed: number = 10;
    protected _velocity: p5.Vector = this.p.createVector(0, 0);
    protected _maxSpeed: number = 10;

    protected _maxAge: number = 100;
    protected _energy: number = 100;
    protected _energyConsumptionRate: number = 0.1;

    protected _chosenPrey: Prey | null = null;
    protected _huntDistance: number = 300;
    protected _isHunting: boolean = false;
    protected _preyDetectChance: number = 0.5;

    protected _detectedPredators: Predator[] = [];
    protected _fleeDistance: number = 100;
    protected _isFleeing: boolean = false;
    protected _predatorDetectChance: number = 0.5;


    constructor(p: p5, position: p5.Vector, ) {
        super(p, position);
    }

    view (): void {
        this.p.push()
        this.p.fill(0, 0, 255);
        this.p.ellipse(this.position.x, this.position.y, 20, 20);
        this.p.pop()
    }
}