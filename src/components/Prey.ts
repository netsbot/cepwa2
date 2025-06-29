import {component, Entity, field} from "@lastolivegames/becsy";

@component export class Prey {
    @field.float64 declare energyValue: number;
    @field.float64 declare fleeDistance: number;
    @field.backrefs declare huntedBy: Entity[];

    @field.float64 declare grazingDistance: number;
    @field.boolean declare target: Entity | null;
}