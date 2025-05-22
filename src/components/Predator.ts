import {component, Entity, field} from "@lastolivegames/becsy";

@component export class Predator {
    @field.float64 declare huntDistance: number;
    @field.float64 declare preyDetectChance: number;
    @field.ref declare target: Entity | null;

}