import {component, field} from "@lastolivegames/becsy";
import {Vector, vectorType} from "../lib/Vector.ts";

@component export class TargetPosition {
    @field(vectorType) declare value: Vector;
    @field.float64 declare speed: number;
}