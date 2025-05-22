import {component} from "@lastolivegames/becsy";
import PredatorBuilder from "./PredatorBuilder.ts";

@component export class Lion {}

export class LionBuilder extends PredatorBuilder {
    protected huntDistance = 500;
    protected preyDetectChance = 0.5;

    protected acceleration = 5;
    protected maxSpeed = 50;
    protected color = [0, 0, 255];
    protected Component = Lion;
}