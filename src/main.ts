import './style.css'
import p5 from 'p5';

import {World} from "@lastolivegames/becsy";
import {DeerBuilder} from "./animals/Deer.ts";

import {MovementSystem} from "./systems/MovementSystem.ts";
import {RenderSystem} from "./systems/RenderSystem.ts";
import {WolfBuilder} from "./animals/Wolf.ts";
import {HuntingSystem} from "./systems/HuntingSystem.ts";
import {DeleterSystem} from "./systems/DeleterSystem.ts";
import {LionBuilder} from "./animals/Lion.ts";

let main = async (p: p5) => {
    const world = await World.create({
        defs: [
            HuntingSystem,
            DeleterSystem,
            MovementSystem,
            RenderSystem, {p: p},
        ]
    });

    const deerBuilder = new DeerBuilder(world);
    const wolfBuilder = new WolfBuilder(world);
    const lionBuilder = new LionBuilder(world);

    p.setup = async () => {
        p.createCanvas(600, 600);

        for (let i = 0; i < 10; i++) {
            deerBuilder.create([Math.random() * p.width, Math.random() * p.height]);
        }

        for (let i = 0; i < 10; i++) {
            wolfBuilder.create([Math.random() * p.width, Math.random() * p.height]);
        }

        for (let i = 0; i < 1; i++) {
            lionBuilder.create([Math.random() * p.width, Math.random() * p.height]);
        }
    }

    p.draw = async () => {
        p.background(220);

        await world.execute()
    }
}

new p5(main)