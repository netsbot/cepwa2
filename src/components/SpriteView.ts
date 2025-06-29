import {component, field} from "@lastolivegames/becsy";

/**
 * Component for rendering sprite images
 */
@component export class SpriteView {
    // Type of sprite to render (must match asset names)
    @field.staticString(["grass", "chick", "pig", "wolf"]) declare value: string;
    
    // Size of the sprite
    @field.float64 declare width: number;
}