import {World} from "@lastolivegames/becsy";
import {Vector} from "../lib/Vector.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {Renderable} from "../components/Viewable.ts";
import {Predator} from "../components/Predator.ts";

export default abstract class PredatorBuilder {
    protected world: World;

    protected abstract huntDistance: number;
    protected abstract preyDetectChance: number ;
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
            Predator, {
                huntDistance: this.huntDistance,
                preyDetectChance: this.preyDetectChance,
                target: null
            },
            MaxSpeed, {value: this.maxSpeed},
            Renderable, {color: this.color},
            this.Component
        );
    }
}