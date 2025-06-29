import {component, field} from "@lastolivegames/becsy";

@component export class BoxView {
    @field.uint8.vector(3)
    declare color: [number, number, number] & {asTypedArray(): Uint8Array};
    @field.uint8 declare width: number;
    @field.uint8 declare height: number;
}