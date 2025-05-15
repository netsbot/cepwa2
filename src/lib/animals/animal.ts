import p5 from "p5";
import Object, {IObjectUpdateProp} from "../object.ts";
import ObjectManager from "../objectManager.ts";

export interface IAnimalUpdateProp extends IObjectUpdateProp {}

export default abstract class Animal extends Object {
    protected abstract _velocity: p5.Vector;
    protected abstract _speed: number;
    protected abstract _maxSpeed: number;

    protected abstract _energy: number;
    protected abstract _energyConsumptionRate: number;
    protected _age: number = 0;
    protected abstract _maxAge: number;
    protected _isAlive: boolean = true;

    static objectManager: ObjectManager;

    protected die(): void {
        this._isAlive = false;
        Animal.objectManager.removeAnimal(this);
    }

    update(props?: IAnimalUpdateProp): void {
        super.update(props);

        this._energy -= this._energyConsumptionRate;

        if (this._energy < 0) {
            this.die()
        }
    }

    get maxSpeed(): number {
        return this._maxSpeed;
    }
}