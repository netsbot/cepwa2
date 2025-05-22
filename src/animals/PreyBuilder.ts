import {World} from "@lastolivegames/becsy";
import {Vector} from "../lib/Vector.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {Prey} from "../components/Prey.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {Renderable} from "../components/Viewable.ts";

export default abstract class PreyBuilder {
    protected world: World;

    protected abstract fleeDistance: number;
    protected abstract predatorDetectChance: number ;
    protected abstract maxSpeed: number;

    protected abstract color: number[];
    protected abstract Component: any;

    constructor(world: World) {
        this.world = world;
    }

    create(position: [number, number]): void {
        let tempVector = new Vector();
        tempVector.x = position[0];
        tempVector.y = position[1];

        this.world.createEntity(
            Position, {value: tempVector},
            Velocity, {value: [0, 0]},
            Prey, {
                fleeDistance: this.fleeDistance,
                predatorDetectChance: this.predatorDetectChance,
                target: null
            },
            MaxSpeed, {value: this.maxSpeed},
            Renderable, {color: this.color},
            this.Component
        );
    }
}