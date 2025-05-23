import {component, field} from "@lastolivegames/becsy";

@component export class Energy {
    @field.float64 declare value: number;
    @field.float64 declare regenRate: number;
}