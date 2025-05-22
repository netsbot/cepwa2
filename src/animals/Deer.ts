import {component} from "@lastolivegames/becsy";
import PreyBuilder from "./PreyBuilder.ts";

@component export class Deer {}

export class DeerBuilder extends PreyBuilder{
    protected fleeDistance = 100;
    protected predatorDetectChance = 0.5;
    protected maxSpeed = 0.5;
    protected color = [255, 0, 0];
    protected Component = Deer;
}