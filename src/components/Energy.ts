import {component, field} from "@lastolivegames/becsy";

@component export class Energy {
    @field.float64 declare value: number;
    @field.float64 declare startingValue: number;
    @field.float64 declare lossPerMovement: number;
}