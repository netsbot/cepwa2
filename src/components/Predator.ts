import {component, Entity, field} from "@lastolivegames/becsy";

/**
 * Component for predator behavior
 */
@component export class Predator {
    // Maximum distance for detecting prey
    @field.float64 declare huntDistance: number;
    
    // Current hunting target
    @field.ref declare target: Entity | null;
}