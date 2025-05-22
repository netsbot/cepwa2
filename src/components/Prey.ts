import {component, Entity, field} from "@lastolivegames/becsy";

@component export class Prey {
    @field.float64 declare fleeDistance: number;
    @field.float64 declare predatorDetectChance: number;
    @field.backrefs declare huntedBy: Entity[];
}