import {component, field} from "@lastolivegames/becsy";

@component export class SpriteView {
    @field.staticString(["grass", "chick", "pig", "wolf"]) declare value: string;
    @field.float64 declare width: number;
}