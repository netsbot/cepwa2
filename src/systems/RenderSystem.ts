import p5 from "p5";
import {System, system} from "@lastolivegames/becsy";
import {Renderable} from "../components/Viewable.ts";
import {Position} from "../components/Position.ts";


@system export class RenderSystem extends System {
    p: p5

    private entities = this.query(q => q.current.with(Renderable, Position))

    execute() {
        for (const entity of this.entities.current) {
            const renderable = entity.read(Renderable);
            const position = entity.read(Position);

            this.p.push()
            this.p.fill(renderable.color[0], renderable.color[1], renderable.color[2]);
            this.p.circle(position.value.x, position.value.y, 10)
            this.p.pop()
        }
    }
}