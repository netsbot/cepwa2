import {ComponentType, World} from "@lastolivegames/becsy";
import {Vegetation} from "../components/Vegetation.ts";
import {Position} from "../components/Position.ts";
import {SpriteView} from "../components/SpriteView.ts";

/**
 * Base builder class for vegetation entities
 */
export abstract class VegetationBuilder {
    protected world: World;

    protected abstract name: string;

    // Nutrition properties
    protected abstract energyValue: number;
    
    // Visual properties
    protected abstract color: number[];
    protected abstract width: number;
    protected abstract height: number;
    
    // Type marker component
    protected abstract Component: ComponentType<any>;

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Creates a vegetation entity at the specified position
     */
    create(position: [number, number]): void {
        this.world.createEntity(
            // Nutritional component
            Vegetation, {energyValue: this.energyValue},
            
            // Position component
            Position, {value: position},
            
            // Visual component
            SpriteView, {
                value: this.name,
                width: 32
            },
            
            // Type marker
            this.Component
        );
    }
}