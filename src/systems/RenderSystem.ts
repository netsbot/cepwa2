import p5 from "p5";
import {System, system} from "@lastolivegames/becsy";
import {DotView} from "../components/DotView.ts";
import {Position} from "../components/Position.ts";
import {BoxView} from "../components/BoxVIew.ts";
import {DeleterSystem} from "./DeleterSystem.ts";
import {SpriteView} from "../components/SpriteView.ts";

@system(s => s.after(DeleterSystem)) 
export class RenderSystem extends System {
    static p: p5;

    // Camera settings
    private zoom = 0.75;
    private cameraX = 350;
    private cameraY = 360;

    // Entity queries for different render types
    private dotViews = this.query(q => q.current.with(DotView, Position));
    private boxViews = this.query(q => q.current.with(BoxView, Position));
    private spriteViews = this.query(q => q.current.with(SpriteView, Position));

    // Asset registry
    static assetsToLoad = new Map<string, string>([
        ["grass", "/assets/grass.png"],
        ["chick", "/assets/chick.png"],
        ["pig", "/assets/pig.png"],
        ["wolf", "/assets/wolf.png"],
    ]);

    static loadedAssets = new Map<string, p5.Image>();

    // Load all sprites at startup
    static async loadAssets() {
        for (const [name, path] of this.assetsToLoad.entries()) {
            const image = await RenderSystem.p.loadImage(path);
            this.loadedAssets.set(name, image);
        }
    }

    initialize() {
        const p5Element = document.getElementById("app");

        if (p5Element == null) {
            throw new Error("P5 element not found");
        }

        // Setup zoom control
        p5Element.addEventListener("wheel", (e) => {
            e.preventDefault();

            // Calculate mouse position in world coordinates before zooming
            const mouseX = e.clientX - p5Element.getBoundingClientRect().left;
            const mouseY = e.clientY - p5Element.getBoundingClientRect().top;

            const worldXBefore = (mouseX - this.cameraX) / this.zoom;
            const worldYBefore = (mouseY - this.cameraY) / this.zoom;

            // Apply zoom
            this.zoom += e.deltaY * -0.01;
            this.zoom = Math.min(Math.max(0.4, this.zoom), 2);

            // Update camera position to keep the point under cursor fixed
            this.cameraX = mouseX - worldXBefore * this.zoom;
            this.cameraY = mouseY - worldYBefore * this.zoom;
        });

        // Setup drag-to-pan
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

            RenderSystem.p.push();
            RenderSystem.p.fill(dot.color[0], dot.color[1], dot.color[2]);
            RenderSystem.p.circle(position.value.x, position.value.y, 10);
            RenderSystem.p.pop();
        }
    }

    renderBoxViews() {
        for (const entity of this.boxViews.current) {
            const box = entity.read(BoxView);
            const position = entity.read(Position);

            RenderSystem.p.push();
            RenderSystem.p.fill(box.color[0], box.color[1], box.color[2]);
            RenderSystem.p.rect(position.value.x, position.value.y, box.width, box.height);
            RenderSystem.p.pop();
        }
    }

    renderSpriteViews() {
        for (const entity of this.spriteViews.current) {
            const sprite = entity.read(SpriteView);
            const position = entity.read(Position);

            const image = RenderSystem.loadedAssets.get(sprite.value);
            if (image) {
                RenderSystem.p.push();
                RenderSystem.p.imageMode(RenderSystem.p.CENTER);
                RenderSystem.p.image(image, position.value.x, position.value.y, sprite.width, sprite.width);
                RenderSystem.p.pop();
            }
        }
    }

    execute() {
        // Apply camera transformations
        RenderSystem.p.translate(this.cameraX, this.cameraY);
        RenderSystem.p.scale(this.zoom);

        // Render all view types
        this.renderDotViews();
        this.renderBoxViews();
        this.renderSpriteViews();
    }
}