import p5 from "p5";
import Object from "../object.ts";

export default abstract class Impassable extends Object {
    protected _position: p5.Vector;
    protected _width: number;
    protected _height: number;

    constructor(p: p5, position: p5.Vector, width: number, height: number) {
        super(p, position);
        this._position = position;
        this._width = width;
        this._height = height;
    }

    get position(): p5.Vector {
        return this._position;
    }

    get corners(): p5.Vector[] {
        return [
            this._position,
            this.p.createVector(this._position.x + this._width, this._position.y),
            this.p.createVector(this._position.x + this._width, this._position.y + this._height),
            this.p.createVector(this._position.x, this._position.y + this._height)
        ];
    }
}