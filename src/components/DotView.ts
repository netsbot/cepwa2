import {component, field} from "@lastolivegames/becsy";

@component export class DotView {
    @field.uint8.vector(3)
    declare color: [number, number, number] & {asTypedArray(): Uint8Array};
}