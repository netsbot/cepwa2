import {system, System} from "@lastolivegames/becsy";
import {ToBeDeleted} from "../components/ToBeDeleted.ts";
import {HuntingSystem} from "./HuntingSystem.ts";

@system(s => s.after(HuntingSystem)) export class DeleterSystem extends System{
    private entities = this.query(q => q.current.with(ToBeDeleted).usingAll.write);

    execute() {
        for (const entity of this.entities.current) {
            entity.delete();
        }
    }

}