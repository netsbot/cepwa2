import {component, field} from "@lastolivegames/becsy";

/**
 * Component for entity energy level and consumption
 */
@component export class Energy {
    // Current energy level
    @field.float64 declare value: number;
    
    // Maximum/initial energy level
    @field.float64 declare startingValue: number;
    
    // Energy consumed per movement update
    @field.float64 declare lossPerMovement: number;
}