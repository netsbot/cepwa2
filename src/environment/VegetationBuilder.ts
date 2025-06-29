import {ComponentType, World} from "@lastolivegames/becsy";
import {Vegetation} from "../components/Vegetation.ts";
import {Position} from "../components/Position.ts";
import {SpriteView} from "../components/SpriteView.ts";

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
            SpriteView, {value: this.Component.name.toLowerCase(), width: 32},
            this.Component
        );
    }
}