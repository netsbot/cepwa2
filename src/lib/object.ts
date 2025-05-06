import p5 from "p5";

export default class Object {
    private p: p5;
    private readonly visualizeForce: boolean = true;
    private forcesToVisualize: p5.Vector[] = [];

    private _position: p5.Vector;
    private _velocity: p5.Vector;
    private _acceleration: p5.Vector;

    private _mass: number;

    get position() {
        return this._position;
    }

    get mass() {
        return this._mass;
    }

    constructor(p: p5, position: p5.Vector, velocity: p5.Vector, acceleration: p5.Vector, mass: number) {
        this.p = p;

        this._position = position;
        this._velocity = velocity;
        this._acceleration = acceleration;

        this._mass = mass;
    }


    private calculateGravity(object: Object) {
        let gravitationalConstant = 0.01;

        let base = p5.Vector.sub(object.position, this._position);
        let direction = base.normalize();

        return direction.mult(gravitationalConstant * object.mass * this._mass / base.magSq());
    }

    private applyForce(force: p5.Vector) {
        let f = force.copy();
        f.div(this._mass);
        this._acceleration.add(f);

        if (this.visualizeForce)
            this.forcesToVisualize.push(force);
    }

    applyGravity(objects: Object[]) {
        for (let object of objects) {
            if (object === this)
                continue;

            let force = this.calculateGravity(object);
            this.applyForce(force);
        }
    }

    private update() {
        this._velocity.add(this._acceleration);
        this._position.add(this._velocity);
        this._acceleration.mult(0); // Reset acceleration after applying it
    }


    private draw() {
        this.p.push();

        if (this.visualizeForce)
            this.drawVisualization();

        this.p.noFill()
        this.p.circle(this._position.x, this._position.y, 20);

        this.p.pop();
    }

    private drawVisualization() {
        this.p.push();

        this.p.stroke(0, 0, 0);
        this.p.line(this._position.x, this._position.y, this._position.x + this._velocity.x * 20, this._position.y + this._velocity.y * 20);

        for (let force of this.forcesToVisualize) {
            this.p.stroke(255, 0, 0);
            this.p.line(
                this._position.x,
                this._position.y,
                this._position.x + force.x * 2000,
                this._position.y + force.y * 2000);
        }

        this.p.pop();
    }

    loop() {
        this.update();
        this.draw();
        this.forcesToVisualize = [];
    }
}