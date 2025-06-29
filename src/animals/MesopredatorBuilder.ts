import {World} from "@lastolivegames/becsy";
import {Vector} from "../lib/Vector.ts";
import {Position} from "../components/Position.ts";
import {Velocity} from "../components/Velocity.ts";
import {Prey} from "../components/Prey.ts";
import {MaxSpeed} from "../components/MaxSpeed.ts";
import {Predator} from "../components/Predator.ts";
import {Acceleration} from "../components/Acceleration.ts";
import {TargetPosition} from "../components/TargetPosition.ts";
import {Energy} from "../components/Energy.ts";
import {SpriteView} from "../components/SpriteView.ts";

/**
 * Base builder class for mesopredator entities (both predator and prey)
 */
export default abstract class MesopredatorBuilder {
    protected world: World;

    // Hunting properties
    protected abstract huntDistance: number;

    // Fleeing properties
    protected abstract fleeDistance: number;
    protected abstract grazingDistance: number;

    // Energy properties
    protected abstract startingEnergy: number;
    protected abstract energyLoss: number;
    protected abstract energyValue: number;

    // Movement properties
    protected abstract acceleration: number;
    protected abstract maxSpeed: number;
    
    // Visual properties
    protected abstract color: number[];
    
    // Type marker component
    protected abstract Component: any;

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Creates a mesopredator entity at the specified position
     * Mesopredators have both predator and prey behaviors
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
            
            // Prey behavior
            Prey, {
                fleeDistance: this.fleeDistance,
                energyValue: this.energyValue,
                grazingDistance: this.grazingDistance
            },
            
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
                value: this.Component.name.toLowerCase(), 
                width: 32
            },
            
            // Type marker
            this.Component
        );
    }
}