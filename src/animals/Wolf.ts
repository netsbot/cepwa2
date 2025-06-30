import {component} from "@lastolivegames/becsy";
import PredatorBuilder from "./PredatorBuilder.ts";

/**
 * Wolf entity type marker
 */
@component export class Wolf {}

/**
 * Builder for Wolf entities - apex predators in the ecosystem
 */
export class WolfBuilder extends PredatorBuilder {
    protected name = "wolf";

    // Hunting properties
    protected huntDistance = 1000;  // Can detect prey from far away

    // Energy properties
    protected startingEnergy = 5;
    protected energyLoss = 0.0005;  // Lower energy loss rate

    // Movement properties
    protected acceleration = 5;
    protected maxSpeed = 50;        // Fastest entity
    
    // Visual properties
    protected color = [0, 0, 255];  // Blue color
    
    // Type marker
    protected Component = Wolf;
}