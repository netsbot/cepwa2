import {component, field} from "@lastolivegames/becsy";

/**
 * Component for plant-based food sources
 */
@component export class Vegetation {
    // Energy gained by consuming this vegetation
    @field.float64 declare energyValue: number;
}