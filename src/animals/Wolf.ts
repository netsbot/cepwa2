import {component} from "@lastolivegames/becsy";
import PredatorBuilder from "./PredatorBuilder.ts";

@component export class Wolf {}

export class WolfBuilder extends PredatorBuilder {
    protected huntDistance = 1000;

    protected startingEnergy = 5;
    protected energyLoss = 0.0005;

    protected acceleration = 5;
    protected maxSpeed = 50;
    protected color = [0, 0, 255];
    protected Component = Wolf;
}