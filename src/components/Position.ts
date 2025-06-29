import {component, field} from "@lastolivegames/becsy";
import {Vector, vectorType} from "../lib/Vector.ts";

/**
 * Component for entity position in world space
 */
@component export class Position {
    @field(vectorType) declare value: Vector;
}