import {component, field} from "@lastolivegames/becsy";
import {Vector, vectorType} from "../lib/Vector.ts";

/**
 * Component for entity movement target
 */
@component export class TargetPosition {
    // Target destination
    @field(vectorType) declare value: Vector;
    
    // Current movement speed toward target
    @field.float64 declare speed: number;
}