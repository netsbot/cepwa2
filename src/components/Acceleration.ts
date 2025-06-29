import {component, field} from "@lastolivegames/becsy";

/**
 * Component for entity acceleration rate
 */
@component export class Acceleration {
    @field.uint8 declare value: number;
}