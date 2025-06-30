import {component} from "@lastolivegames/becsy";
import MesopredatorBuilder from "./MesopredatorBuilder.ts";

/**
 * Pig entity type marker
 */
@component export class Pig {}

/**
 * Builder for Pig entities - mid-level in the food chain
 * Both predator and prey (mesopredator)
 */
export class PigBuilder extends MesopredatorBuilder {
    protected name = "pig";

    // Hunting properties
    protected huntDistance = 200;  // Medium detection range
    
    // Fleeing properties
    protected fleeDistance = 500;
    protected grazingDistance = 500;
    
    // Energy properties
    protected startingEnergy = 5;
    protected energyLoss = 0.001;
    protected energyValue = 3;     // Good energy value when consumed
    
    // Movement properties
    protected acceleration = 5;
    protected maxSpeed = 40;       // Medium speed
    
    // Visual properties
    protected color = [0, 255, 0]; // Green color
    
    // Type marker
    protected Component = Pig;
}