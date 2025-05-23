import {component, Entity, field} from "@lastolivegames/becsy";

@component export class Predator {
    @field.boolean declare hunting: boolean;
    @field.float64 declare huntDistance: number;
    @field.ref declare target: Entity | null;
}