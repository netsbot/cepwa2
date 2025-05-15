import p5 from "p5";

export interface IObjectUpdateProp {
    position?: p5.Vector;
}

export default abstract class Object {
    protected p: p5;
    protected _position: p5.Vector;

    get position() {
        return this._position;
    }

    protected constructor(p: p5, position: p5.Vector) {
        this.p = p;
        this._position = position;
    }

    abstract view(): void;

    update(props?: IObjectUpdateProp): void {
        if (props?.position) {
            this._position = props.position;
        }
    }
}