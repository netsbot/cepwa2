import {component, Entity, field} from "@lastolivegames/becsy";

/**
 * Component for prey behavior and properties
 */
@component export class Prey {
    // Energy provided when consumed by a predator
    @field.float64 declare energyValue: number;
    
    // Distance at which prey will start fleeing from predators
    @field.float64 declare fleeDistance: number;
    
    // References to predators hunting this prey
    @field.backrefs declare huntedBy: Entity[];

    // Distance within which prey will seek vegetation
    @field.float64 declare grazingDistance: number;
    
    // Current grazing target
    @field.boolean declare target: Entity | null;
}