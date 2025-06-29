import './style.css'
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
import { RNG } from './lib/RNG.ts';

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
    ]
});

// Initialize the world with entities based on slider values
const initializeWorld = async () => {
    RNG.setSeed(seedInput.value);

    const chickCount = parseInt(chicksSlider.value);
    const pigCount = parseInt(pigsSlider.value);
    const wolfCount = parseInt(wolvesSlider.value);
    const grassCount = parseInt(grassSlider.value);

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
const pigsSlider = document.getElementById('pigs-slider') as HTMLInputElement;
const pigsValue = document.getElementById('pigs-value') as HTMLSpanElement;
pigsSlider.addEventListener('input', () => {
    pigsValue.textContent = pigsSlider.value;
});

const wolvesSlider = document.getElementById('wolves-slider') as HTMLInputElement;
const wolvesValue = document.getElementById('wolves-value') as HTMLSpanElement;
wolvesSlider.addEventListener('input', () => {
    wolvesValue.textContent = wolvesSlider.value;
});

const chicksSlider = document.getElementById('chicks-slider') as HTMLInputElement;
const chicksValue = document.getElementById('chicks-value') as HTMLSpanElement;
chicksSlider.addEventListener('input', () => {
    chicksValue.textContent = chicksSlider.value;
});

const grassSlider = document.getElementById('grass-slider') as HTMLInputElement;
const grassValue = document.getElementById('grass-value') as HTMLSpanElement;
grassSlider.addEventListener('input', () => {
    grassValue.textContent = grassSlider.value;
});

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
});

// Stop button event handler
const stopBtn = document.getElementById("stop-btn") as HTMLButtonElement;
stopBtn?.addEventListener("click", () => {
    running = false;
    startBtn.disabled = false;
});





