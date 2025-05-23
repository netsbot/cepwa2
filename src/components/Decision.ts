import {component, field} from "@lastolivegames/becsy";

@component
export class Decision {
    @field.boolean declare free: boolean;
    @field.float64 declare feedChance: number;
    @field.float64 declare reproduceChance: number;
}