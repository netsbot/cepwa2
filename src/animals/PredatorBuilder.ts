import {ComponentType, World} from "@lastolivegames/becsy";
import {Vector} from "../lib/Vector.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {Predator} from "../components/Predator.ts";
import {Acceleration} from "../components/Acceleration.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";
import {SpriteView} from "../components/SpriteView.ts";

/**
 * Base builder class for predator entities
 */
export default abstract class PredatorBuilder {
    protected world: World;
    protected abstract name: string;

    // Behavior properties
    protected abstract huntDistance: number;

    // Energy properties
    protected abstract startingEnergy: number;
    protected abstract energyLoss: number;

    // Movement properties
    protected abstract acceleration: number;
    protected abstract maxSpeed: number;
    
    // Visual properties
    protected abstract color: number[];
    
    // Type marker component
    protected abstract Component: ComponentType<any>;

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Creates a predator entity at the specified position
     */
    create(position: [number, number]): void {
        const positionVector = new Vector();
        positionVector.x = position[0];
        positionVector.y = position[1];

        this.world.createEntity(
            // Position components
            Position, {value: positionVector},
            Velocity, {value: [0, 0]},
            TargetPosition, {value: [NaN, NaN]},
            
            // Predator behavior
            Predator, {
                huntDistance: this.huntDistance,
            },
            
            // Movement components
            MaxSpeed, {value: this.maxSpeed},
            Acceleration, {value: this.acceleration},
            
            // Energy component
            Energy, {
                value: this.startingEnergy, 
                startingValue: this.startingEnergy, 
                lossPerMovement: this.energyLoss
            },
            
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