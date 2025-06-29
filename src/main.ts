import './style.css'
// @ts-ignore
import p5 from 'p5';

import {System, World} from "@lastolivegames/becsy";
import {DeerBuilder} from "./animals/Deer.ts";

import {MovementSystem} from "./systems/MovementSystem.ts";
import {RenderSystem} from "./systems/RenderSystem.ts";
import {WolfBuilder} from "./animals/Wolf.ts";
import {HuntingSystem} from "./systems/HuntingSystem.ts";
import {DeleterSystem} from "./systems/DeleterSystem.ts";
import {LionBuilder} from "./animals/Lion.ts";
import {FleeingSystem} from "./systems/FleeingSystem.ts";
import {GrassBuilder} from "./environment/Grass.ts";
import {GrazingSystem} from "./systems/GrazingSystem.ts";
import {WanderSystem} from "./systems/WanderSystem.ts";

const lifecycleGroup = System.group(HuntingSystem, FleeingSystem, GrazingSystem, WanderSystem);
const utilityGroup = System.group(MovementSystem, DeleterSystem);
const renderGroup = System.group(RenderSystem);

const world = await World.create({
    defs: [
        lifecycleGroup,
        utilityGroup,
        renderGroup
    ]
});

let generateRandomPosition = (p: p5): [number, number] => {
    return [(Math.random() * 2 - 1) * 600, (Math.random() * 2 - 1) * 600];
}

const frame = world.createCustomExecutor(lifecycleGroup, utilityGroup, renderGroup);
let main = async (p: p5) => {
    RenderSystem.p = p;

    const deerBuilder = new DeerBuilder(world);
    const wolfBuilder = new WolfBuilder(world);
    const lionBuilder = new LionBuilder(world);
    const grassBuilder = new GrassBuilder(world);

    p.setup = async () => {
        let canvas = p.createCanvas(1000, 1000);
        canvas.parent("app");

        for (let i = 0; i < 20; i++) {
            deerBuilder.create(generateRandomPosition(p));
        }

        for (let i = 0; i < 5; i++) {
            wolfBuilder.create(generateRandomPosition(p));
        }

        for (let i = 0; i < 1; i++) {
            lionBuilder.create(generateRandomPosition(p));
        }

        for (let i = 0; i < 50; i++) {
            grassBuilder.create(generateRandomPosition(p));
        }
    }

    p.draw = async () => {
        p.background(220);

        await frame.begin()

        await frame.execute(lifecycleGroup);
        await frame.execute(utilityGroup);
        await frame.execute(renderGroup);

        await frame.end();
    }
}

new p5(main)