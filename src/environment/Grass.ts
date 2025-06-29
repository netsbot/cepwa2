import {VegetationBuilder} from "./VegetationBuilder.ts";
import {component} from "@lastolivegames/becsy";

@component export class Grass {};

export class GrassBuilder extends VegetationBuilder {
    protected energyValue: number = 1;
    protected color: number[] = [0, 255, 0];
    protected width: number = 10;
    protected height: number = 10;
    protected Component = Grass;
}