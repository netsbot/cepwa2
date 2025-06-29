import {component} from "@lastolivegames/becsy";
import PreyBuilder from "./PreyBuilder.ts";

@component
export class Chick {
}

export class ChickBuilder extends PreyBuilder {
    protected fleeDistance = 200;
    protected grazingDistance = 200;

    protected startingEnergy = 3;
    protected energyLoss = 0.0005;
    protected energyValue = 1;

    protected acceleration = 3;
    protected maxSpeed = 40;
    protected color = [255, 0, 0];
    protected Component = Chick;
}