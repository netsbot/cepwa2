import {VegetationBuilder} from "./VegetationBuilder.ts";
import {component} from "@lastolivegames/becsy";

/**
 * Grass entity type marker
 */
@component export class Grass {};

/**
 * Builder for Grass vegetation entities
 */
export class GrassBuilder extends VegetationBuilder {
    // Energy properties
    protected energyValue: number = 1;
    
    // Visual properties
    protected color: number[] = [0, 255, 0]; // Green color
    protected width: number = 10;
    protected height: number = 10;
    
    // Type marker
    protected Component = Grass;
}