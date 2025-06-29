import {component, field} from "@lastolivegames/becsy";

/**
 * Component for limiting entity movement speed
 */
@component export class MaxSpeed {
    @field.uint8 declare value: number;
}