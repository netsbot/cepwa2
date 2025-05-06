import './style.css'
import p5 from "p5"

import Object from "./lib/object.ts";

let main = (p: p5) => {
    let objects: Object[] = [];
    p.setup = () => {
        p.createCanvas(600, 600);

        for (let i = 0; i < 3; i++) {
            let position = p.createVector(p.random(0, p.width), p.random(0, p.height));
            let velocity = p5.Vector.random2D()
            let acceleration = p.createVector(0, 0);
            let mass = p.random(1, 5);

            objects.push(new Object(p, position, velocity, acceleration, mass));
        }

    }

    p.draw = () => {
        p.background(220);

        let averageObjectPosition = p.createVector(0, 0);
        for (let object of objects) {
            object.applyGravity(objects);
            object.loop()
            averageObjectPosition.add(object.position);
        }
        averageObjectPosition.div(objects.length);

        p.translate(p.width / 2 - averageObjectPosition.x, p.height / 2 - averageObjectPosition.y);

    }
}

new p5(main)