import {ComponentType, World} from "@lastolivegames/becsy";
import {Vector} from "../lib/Vector.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {Prey} from "../components/Prey.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {DotView} from "../components/DotView.ts";
import {Acceleration} from "../components/Acceleration.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";

export default abstract class PreyBuilder {
    protected world: World;

    protected abstract fleeDistance: number;
    protected abstract grazingDistance: number;

    protected abstract startingEnergy: number;
    protected abstract energyLoss: number;
    protected abstract energyValue: number;

    protected abstract acceleration: number;
    protected abstract maxSpeed: number;
    protected abstract color: number[];
    protected abstract Component: ComponentType<any>;

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
            TargetPosition, {value: [NaN, NaN]},
            Prey, {
                fleeDistance: this.fleeDistance,
                energyValue: this.energyValue,
                grazingDistance: this.grazingDistance
            },
            MaxSpeed, {value: this.maxSpeed},
            Energy, {value: this.startingEnergy, startingValue: this.startingEnergy, lossPerMovement: this.energyLoss},
            Acceleration, {value: this.acceleration},
            DotView, {color: this.color},
            this.Component
        );
    }
}