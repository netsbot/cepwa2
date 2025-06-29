import {component} from "@lastolivegames/becsy";
import PredatorBuilder from "./PredatorBuilder.ts";

@component export class Lion {}

export class LionBuilder extends PredatorBuilder {
    protected huntDistance = 1000;

    protected startingEnergy = 10;
    protected energyLoss = 0.0005;

    protected acceleration = 5;
    protected maxSpeed = 50;
    protected color = [0, 0, 255];
    protected Component = Lion;
}