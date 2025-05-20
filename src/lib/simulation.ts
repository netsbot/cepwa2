import ObjectManager from "./objectManager.ts";
import Prey, {IPrey} from "./animals/prey.ts";
import Mesopredator from "./animals/mesopredator.ts";
import Predator, {IPredator} from "./animals/predator.ts";

export default class Simulation {
    objectManager: ObjectManager;

    constructor(objectManager: ObjectManager) {
        this.objectManager = objectManager;
    }

    // Collect all available preys for a given preyChoices array
    collectAvailablePreys(preyChoices: (typeof Prey | typeof Mesopredator)[]): IPrey[] {
        const availablePreys: IPrey[] = [];
        for (let preySpecies of preyChoices) {
            if (preySpecies.prototype instanceof Mesopredator) {
                availablePreys.push(...this.objectManager.getMesopredatorsFromSpecies(preySpecies as typeof Mesopredator));
            } else {
                availablePreys.push(...this.objectManager.getPreysFromSpecies(preySpecies as typeof Prey));
            }
        }
        return availablePreys;
    }

    // Collect all available predators for a given predatorChoices array
    collectAvailablePredators(predatorChoices: (typeof Predator | typeof Mesopredator)[]): IPredator[] {
        const availablePredators: IPredator[] = [];
        for (let predatorSpecies of predatorChoices) {
            if (predatorSpecies.prototype instanceof Mesopredator) {
                availablePredators.push(...this.objectManager.getMesopredatorsFromSpecies(predatorSpecies as typeof Mesopredator));
            } else {
                availablePredators.push(...this.objectManager.getPredatorsFromSpecies(predatorSpecies as typeof Predator));
            }
        }
        return availablePredators;
    }

    // Update and render all predators
    updatePredators() {
        for (let species of this.objectManager.predators) {
            let animals = species[1];
            let availablePreys = this.collectAvailablePreys(species[0].preyChoices);

            for (let animal of animals) {
                animal.update({ availablePreys });
                animal.view();
            }
        }
    }

    // Update and render all preys
    updatePreys() {
        for (let species of this.objectManager.preys) {
            let animals = species[1];
            let availablePredators = this.collectAvailablePredators(species[0].predatorChoices);

            for (let animal of animals) {
                animal.update({ availablePredators });
                animal.view();
            }
        }
    }

    // Update and render all mesopredators
    updateMesopredators() {
        for (let species of this.objectManager.mesopredators) {
            let animals = species[1];
            let availablePreys = this.collectAvailablePreys(species[0].preyChoices);
            let availablePredators = this.collectAvailablePredators(species[0].predatorChoices);

            for (let animal of animals) {
                animal.update({ availablePreys, availablePredators });
                animal.view();
            }
        }
    }

    // Render all impassable objects
    renderImpassables() {
        for (let impassable of this.objectManager.impassables) {
            impassable.view();
        }
    }
}