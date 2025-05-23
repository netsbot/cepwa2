import {System, system} from "@lastolivegames/becsy";
import {RenderSystem} from "./RenderSystem.ts";

@system export class CameraControlSystem extends System {
    private renderSystem = this.attach(RenderSystem);
    private zoom = 1;
    private cameraX = 0;
    private cameraY = 0;

    initialize() {
        let p5Element = document.getElementById("app");

        if (p5Element == null) {
            throw new Error("P5 element not found");
        }

        p5Element.addEventListener("wheel", (e) => {
            e.preventDefault();

            // Calculate mouse position in world coordinates BEFORE zooming
            const mouseX = e.clientX - p5Element.getBoundingClientRect().left;
            const mouseY = e.clientY - p5Element.getBoundingClientRect().top;

            const worldXBefore = (mouseX - this.cameraX) / this.zoom;
            const worldYBefore = (mouseY - this.cameraY) / this.zoom;

            this.zoom += e.deltaY * -0.01;
            this.zoom = Math.min(Math.max(0.5, this.zoom), 2);

            // Calculate new camera position to keep the world point under the mouse
            this.cameraX = mouseX - worldXBefore * this.zoom;
            this.cameraY = mouseY - worldYBefore * this.zoom;
        });

        p5Element.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                this.cameraX += e.movementX;
                this.cameraY += e.movementY;
            }
        });
    }

    execute() {
        // Apply translation first, then scale
        this.renderSystem.p.translate(this.cameraX, this.cameraY);
        this.renderSystem.p.scale(this.zoom);
    }
}