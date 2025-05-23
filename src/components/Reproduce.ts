import {component, field} from "@lastolivegames/becsy";

@component export class Reproduce {
    @field.boolean declare reproducing: boolean;
    @field.float64 declare energyCost: number;
}