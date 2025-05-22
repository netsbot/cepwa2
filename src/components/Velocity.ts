import {component, field} from "@lastolivegames/becsy";
import {Vector, vectorType} from "../lib/Vector.ts";

@component export class Velocity {
    @field(vectorType) declare value: Vector;
}