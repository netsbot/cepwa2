import {component} from "@lastolivegames/becsy";
import MesopredatorBuilder from "./MesopredatorBuilder.ts";

@component export class Pig {}

export class PigBuilder extends MesopredatorBuilder {
    protected huntDistance = 500;

    protected fleeDistance = 500;
    protected grazingDistance = 500;

    protected startingEnergy = 5;
    protected energyLoss = 0.001;
    protected energyValue = 3;

    protected acceleration = 5;
    protected maxSpeed = 40;
    protected color = [0, 255, 0];
    protected Component = Pig;
}