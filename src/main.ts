import './style.css'
// @ts-ignore
import p5 from 'p5';

import {System, World} from "@lastolivegames/becsy";
import {ChickBuilder} from "./animals/Chick.ts";
import {MovementSystem} from "./systems/MovementSystem.ts";
import {RenderSystem} from "./systems/RenderSystem.ts";
import {PigBuilder} from "./animals/Pig.ts";
import {HuntingSystem} from "./systems/HuntingSystem.ts";
import {DeleterSystem} from "./systems/DeleterSystem.ts";
import {WolfBuilder} from "./animals/Wolf.ts";
import {FleeingSystem} from "./systems/FleeingSystem.ts";
import {GrassBuilder} from "./environment/Grass.ts";
import {GrazingSystem} from "./systems/GrazingSystem.ts";
import {WanderSystem} from "./systems/WanderSystem.ts";
import {EnergySystem} from "./systems/EnergySystem.ts";
import {RNG} from './lib/RNG.ts';

// Disable FES
p5.disableFriendlyErrors = true;

// Group systems by their logical purpose
const lifecycleGroup = System.group(HuntingSystem, FleeingSystem, GrazingSystem, WanderSystem);
const utilityGroup = System.group(MovementSystem, DeleterSystem, EnergySystem);
const renderGroup = System.group(RenderSystem);

// Initialize the ECS world
let world = await World.create({
    defs: [
        lifecycleGroup,
        utilityGroup,
        renderGroup
    ],
    maxEntities: 20000,
});

// FPS counter system
let lastFpsTime = 0;
let lastFrameCount = 0;

// Initialize the world with entities based on input values
const initializeWorld = async () => {
    RNG.setSeed(seedInput.value);

    const chickCount = parseInt(chicksInput.value);
    const pigCount = parseInt(pigsInput.value);
    const wolfCount = parseInt(wolvesInput.value);
    const grassCount = parseInt(grassInput.value);

    // Validate input values
    if (isNaN(chickCount) || chickCount < 0) {
        alert("Invalid number of chicks");
        return;
    }

    if (isNaN(pigCount) || pigCount < 0) {
        alert("Invalid number of pigs");
        return;
    }

    if (isNaN(wolfCount) || wolfCount < 0) {
        alert("Invalid number of wolves");
        return;
    }

    if (isNaN(grassCount) || grassCount < 0) {
        alert("Invalid number of grass patches");
        return;
    }

    console.log(`Initializing world with ${chickCount} chicks, ${pigCount} pigs, ${wolfCount} wolves, and ${grassCount} grass patches.`);


    // Initialize entity builders
    const chickBuilder = new ChickBuilder(world);
    const pigBuilder = new PigBuilder(world);
    const wolfBuilder = new WolfBuilder(world);
    const grassBuilder = new GrassBuilder(world);

    // Create entities in the world
    for (let i = 0; i < chickCount; i++) {
        chickBuilder.create(generateRandomPosition());
    }

    for (let i = 0; i < pigCount; i++) {
        pigBuilder.create(generateRandomPosition());
    }

    for (let i = 0; i < wolfCount; i++) {
        wolfBuilder.create(generateRandomPosition());
    }

    for (let i = 0; i < grassCount; i++) {
        grassBuilder.create(generateRandomPosition());
    }
}


// UI Controls setup
const pigsInput = document.getElementById('pigs-input') as HTMLInputElement;
const wolvesInput = document.getElementById('wolves-input') as HTMLInputElement;
const chicksInput = document.getElementById('chicks-input') as HTMLInputElement;
const grassInput = document.getElementById('grass-input') as HTMLInputElement;

// Initialize FPS counter
const fpsCounter = document.getElementById('fps-counter') as HTMLParagraphElement;

// Setup random seed
const seedInput = document.getElementById('seed-input') as HTMLInputElement;
seedInput.value = String(Math.random());

// Simulation state
let running = false;
let initialized = false;

// Helper function to generate random positions
const generateRandomPosition = (): [number, number] => {
    return [RNG.nextInt(-600, 600), RNG.nextInt(-600, 600)];
};

// Main p5.js setup
const main = async (p: p5) => {
    RenderSystem.p = p;

    // Create a custom frame executor for the ECS systems
    const frame = world.createCustomExecutor(lifecycleGroup, utilityGroup, renderGroup);

    // p5.js setup function
    p.setup = async () => {
        await RenderSystem.loadAssets();

        let canvas = p.createCanvas(700, 700);
        canvas.parent("app");
    };

    // p5.js draw function - runs every frame
    p.draw = async () => {
        if (!running)
            return;

        p.background(220);

        // Execute ECS systems in sequence
        await frame.begin();
        await frame.execute(lifecycleGroup);

        await frame.execute(utilityGroup);
        await frame.execute(renderGroup);
        await frame.end();

        if (lastFpsTime + 1000 < Date.now()) {
            const fps = Math.round((p.frameCount - lastFrameCount) / ((Date.now() - lastFpsTime) / 1000));
            fpsCounter.textContent = `FPS: ${fps}`;
            lastFpsTime = Date.now();
            lastFrameCount = p.frameCount;
        }
    };
};

// Initialize p5.js instance
new p5(main);

// Start button event handler
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
startBtn?.addEventListener("click", async () => {
    if (!initialized) {
        await initializeWorld();
        initialized = true;
    }
    running = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

// Stop button event handler
const stopBtn = document.getElementById("stop-btn") as HTMLButtonElement;
stopBtn?.addEventListener("click", () => {
    running = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
});





