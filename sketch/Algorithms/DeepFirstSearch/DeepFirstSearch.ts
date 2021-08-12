/// <reference path = "../../Field/Geometry.ts" />
/// <reference path = "../../Field/FieldController.ts" />

class DeepFirstSearch extends FieldController {
    MarkPosition(state = States.empty) {
        this.MarkCell(this.position.x, this.position.y, state);
    }

    positions: Array<CheckType>;

    constructor(canvasManager: CanvasManager, step: number, initialPosition: Vec2 = undefined) {
        super(canvasManager, step, initialPosition);
        this.positions = new Array<CheckType>();
        this.MarkPosition();
        this.optionalReset = (hard: boolean = false) => {
            if (hard || !Calc.IsInside(this.position.x, this.position.y, this.cells)) {
                this.stage = 0;
                this.position = FieldController.GetSpawn(this.canvasManager.width, this.canvasManager.height, this.step);
                this.positions = new Array<CheckType>();
                this.MarkPosition();
            }
        }
        this.stageActions = [
            this.Search
        ];
        this.Draw();
    }

    Search = () => {
        let state: States;
        let check: CheckType;
        let walls = this.GetAvailablePoints(this.position, 1, cell => {
            return cell.state == States.wall;
        });
        if (walls.length > 0) {
            state = States.empty;
            check = walls[0];
            this.positions.push({ checkPoint: this.position, clearPoint: check.clearPoint });
            this.MarkCell(check.checkPoint.x, check.checkPoint.y, state);
        } else {
            state = States.visited;
            if(this.positions.length == 0) {
                this.stage++;
                this.MarkCell(this.position.x, this.position.y, state);
                return true;
            }
            check = this.positions.pop();
            this.MarkCell(this.position.x, this.position.y, state);
        }
        let p = check.clearPoint;
        this.MarkCell(p.x, p.y, state);
        this.position = check.checkPoint;
        return false;
    }
}