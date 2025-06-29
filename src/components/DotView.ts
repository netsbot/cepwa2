import {component, field} from "@lastolivegames/becsy";

/**
 * Component for rendering circular shapes
 */
@component export class DotView {
    // RGB color values (0-255)
    @field.uint8.vector(3)
    declare color: [number, number, number] & {asTypedArray(): Uint8Array};
}