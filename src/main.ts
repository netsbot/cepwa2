import './style.css'
import p5 from "p5"

import Wolf from "./lib/mesopredators/wolf.ts";
import Deer from "./lib/preys/deer.ts";
import ObjectManager from "./lib/objectManager.ts";
import Prey from "./lib/animals/prey.ts";
import Predator from "./lib/animals/predator.ts";
import Animal from "./lib/animals/animal.ts";

let main = (p: p5) => {
    let objectManager: ObjectManager = new ObjectManager();
    Animal.objectManager = objectManager;
    Deer.predatorChoices = [Wolf];
    Wolf.preyChoices = [Deer];

    p.setup = () => {
        p.createCanvas(600, 600);

        objectManager.addAnimal(new Wolf(p, p.createVector(300, 300)));
        objectManager.addAnimal(new Deer(p, p.createVector(100, 100)));
        objectManager.addAnimal(new Deer(p, p.createVector(300, 100)));
    }

    p.draw = () => {
        p.background(255);

        let predators = objectManager.predators;
        let preys = objectManager.preys;

        for (let species of predators) {
            let animals = species[1];
            let availablePreys: Prey[] = [];

            for (let preySpecies of species[0].preyChoices) {
                availablePreys.push(...objectManager.getAnimalsFromSpecies(preySpecies));
            }

            for (let animal of animals) {
                animal.update({availablePreys: availablePreys});
                animal.view();
            }
        }

        for (let species of preys) {
            let animals = species[1];

            let availablePredators: Predator[] = [];

            for (let predatorSpecies of species[0].predatorChoices) {
                availablePredators.push(...objectManager.getAnimalsFromSpecies(predatorSpecies));
            }

            for (let animal of animals) {
                animal.update({availablePredators: availablePredators});
                animal.view();
            }
        }
    }
}

new p5(main)