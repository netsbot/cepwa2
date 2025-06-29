import {component, field} from "@lastolivegames/becsy";
import {Vector, vectorType} from "../lib/Vector.ts";

/**
 * Component for entity movement velocity
 */
@component export class Velocity {
    @field(vectorType) declare value: Vector;
}