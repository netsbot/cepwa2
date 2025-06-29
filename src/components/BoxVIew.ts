import {component, field} from "@lastolivegames/becsy";

/**
 * Component for rendering rectangular shapes
 */
@component export class BoxView {
    // RGB color values (0-255)
    @field.uint8.vector(3)
    declare color: [number, number, number] & {asTypedArray(): Uint8Array};
    
    // Rectangle dimensions
    @field.uint8 declare width: number;
    @field.uint8 declare height: number;
}