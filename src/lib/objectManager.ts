import Animal from "./animals/animal.ts";
import Predator from "./animals/predator.ts";
import Prey from "./animals/prey.ts";
import Mesopredator from "./animals/mesopredator.ts";

export default class ObjectManager {
    private _predators: Map<typeof Predator, Predator[]> = new Map<typeof Predator, Predator[]>();
    private _preys: Map<typeof Prey, Prey[]> = new Map<typeof Prey, Prey[]>();
    private _mesopredators: Map<typeof Mesopredator, Mesopredator[]> = new Map<typeof Mesopredator, Mesopredator[]>();

    addAnimal(animal: Animal) {
        // sort animals into groups
        // can use type guards to make it more reusable

        if (animal instanceof Predator) {
            if (!this._predators.has(animal.constructor as typeof Predator)) {
                this._predators.set(animal.constructor as typeof Predator, []);
            }
            this._predators.get(animal.constructor as typeof Predator)?.push(animal);
        } else if (animal instanceof Prey) {
            if (!this._preys.has(animal.constructor as typeof Prey)) {
                this._preys.set(animal.constructor as typeof Prey, []);
            }
            this._preys.get(animal.constructor as typeof Prey)?.push(animal);
        } else if (animal instanceof Mesopredator) {
            if (!this._mesopredators.has(animal.constructor as typeof Mesopredator)) {
                this._mesopredators.set(animal.constructor as typeof Mesopredator, []);
            }
            this._mesopredators.get(animal.constructor as typeof Mesopredator)?.push(animal);
        }


    }

    getAnimalsFromSpecies(species: typeof Predator): Predator[];
    getAnimalsFromSpecies(species: typeof Prey): Prey[];
    getAnimalsFromSpecies(species: typeof Mesopredator): Mesopredator[];
    getAnimalsFromSpecies(
        species: typeof Predator | typeof Prey | typeof Mesopredator
    ): Predator[] | Prey[] | Mesopredator[] {
        if (species.prototype instanceof Predator || species === Predator) {
            return (this._predators.get(species as typeof Predator) ?? []) as Predator[];
        } else if (species.prototype instanceof Prey || species === Prey) {
            return (this._preys.get(species as typeof Prey) ?? []) as Prey[];
        } else {
            return (this._mesopredators.get(species as typeof Mesopredator) ?? []) as Mesopredator[];
        }
    }


    removeAnimal(animal: Animal) {
        // Determine which map and species type the animal belongs to
        let map: Map<any, any[]>;
        let species: any;

        if (animal instanceof Predator) {
            map = this._predators;
            species = animal.constructor as typeof Predator;
        } else if (animal instanceof Prey) {
            map = this._preys;
            species = animal.constructor as typeof Prey;
        } else if (animal instanceof Mesopredator) {
            map = this._mesopredators;
            species = animal.constructor as typeof Mesopredator;
        } else {
            return;
        }

        // Get the array of animals for the species
        const animals = map.get(species);
        if (animals) {
            // Find the index of the animal to remove
            const index = animals.indexOf(animal);
            if (index !== -1) {
                animals.splice(index, 1);
            }
        }
    }

    getAllAnimals(): Animal[] {
        const allAnimals: Animal[] = [];
        this._predators.forEach(predators => allAnimals.push(...predators));
        this._preys.forEach(preys => allAnimals.push(...preys));
        return allAnimals;
    }

    get predators(): Map<typeof Predator, Predator[]> {
        return this._predators;
    }

    get preys(): Map<typeof Prey, Prey[]> {
        return this._preys;
    }
}