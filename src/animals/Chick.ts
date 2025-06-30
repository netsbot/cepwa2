import {component} from "@lastolivegames/becsy";
import PreyBuilder from "./PreyBuilder.ts";

/**
 * Chick entity type marker
 */
@component
export class Chick {
}

/**
 * Builder for Chick entities - lowest in the food chain
 */
export class ChickBuilder extends PreyBuilder {
    protected name = "chick";

    // Behavior properties
    protected fleeDistance = 200;     // Short flee distance
    protected grazingDistance = 200;   // Short grazing distance

    // Energy properties
    protected startingEnergy = 3;
    protected energyLoss = 0.0005;
    protected energyValue = 1;         // Low energy value when consumed

    // Movement properties
    protected acceleration = 3;
    protected maxSpeed = 40;           // Average speed
    
    // Visual properties
    protected color = [255, 0, 0];     // Red color
    
    // Type marker
    protected Component = Chick;
}