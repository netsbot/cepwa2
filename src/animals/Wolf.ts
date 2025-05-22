import {component} from "@lastolivegames/becsy";
import MesopredatorBuilder from "./MesopredatorBuilder.ts";

@component export class Wolf {}

export class WolfBuilder extends MesopredatorBuilder {
    protected huntDistance = 300;
    protected preyDetectChance = 0.5;

    protected fleeDistance = 50;

    protected acceleration = 3;
    protected maxSpeed = 40;
    protected color = [0, 255, 0];
    protected Component = Wolf;
}