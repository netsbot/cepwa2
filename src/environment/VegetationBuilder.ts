import {ComponentType, World} from "@lastolivegames/becsy";
import {Vegetation} from "../components/Vegetation.ts";
import {Position} from "../components/Position.ts";
import {BoxView} from "../components/BoxVIew.ts";

export abstract class VegetationBuilder {
    protected world: World;

    protected abstract energyValue: number;
    protected abstract color: number[];
    protected abstract width: number;
    protected abstract height: number;
    protected abstract Component: ComponentType<any>;

    constructor(world: World) {
        this.world = world;
    }

    create(position: [number, number]): void {
        this.world.createEntity(
            Vegetation, {energyValue: this.energyValue},
            Position, {value: position},
            BoxView, {color: this.color, width: 10, height: 10},
            this.Component
        );
    }
}