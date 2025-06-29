import p5 from "p5";
import {System, system} from "@lastolivegames/becsy";
import {DotView} from "../components/DotView.ts";
import {Position} from "../components/Position.ts";
import {BoxView} from "../components/BoxVIew.ts";
import {DeleterSystem} from "./DeleterSystem.ts";


@system(s => s.after(DeleterSystem)) export class RenderSystem extends System {
    static p: p5;

    private zoom = 0.75;
    private cameraX = 0;
    private cameraY = 0;

    private dotViews = this.query(q => q.current.with(DotView, Position))
    private boxViews = this.query(q => q.current.with(BoxView, Position));

    initialize() {
        console.log("CameraControlSystem initialized");

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
            this.zoom = Math.min(Math.max(0.4, this.zoom), 2);

            console.log(this.zoom)

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

    renderDotViews() {
        for (const entity of this.dotViews.current) {
            const dot = entity.read(DotView);
            const position = entity.read(Position);

            RenderSystem.p.push()
            RenderSystem.p.fill(dot.color[0], dot.color[1], dot.color[2]);
            RenderSystem.p.circle(position.value.x, position.value.y, 10)
            RenderSystem.p.pop()
        }
    }

    renderBoxViews() {
        for (const entity of this.boxViews.current) {
            const box = entity.read(BoxView);
            const position = entity.read(Position);

            RenderSystem.p.push()
            RenderSystem.p.fill(box.color[0], box.color[1], box.color[2]);
            RenderSystem.p.rect(position.value.x, position.value.y, box.width, box.height);
            RenderSystem.p.pop()
        }
    }


    execute() {
        RenderSystem.p.translate(this.cameraX, this.cameraY);
        RenderSystem.p.scale(this.zoom);

        this.renderDotViews();
        this.renderBoxViews();
    }
}