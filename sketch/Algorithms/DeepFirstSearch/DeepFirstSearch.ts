/// <reference path = "../../Field/Geometry.ts" />
/// <reference path = "../../Field/FieldController.ts" />

class DeepFirstSearch extends FieldController {
    MarkPosition(payload: Payload = PrimAlgorithm.SpawnPayload) {
        this.cells[this.position.x][this.position.y].payload = payload;
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
                this.MarkPosition();
            }
        }
        this.stageActions = [
            this.Search
        ];
        this.Draw();
    }

    Search = () => {
        let payload: Payload;
        let check: CheckType;
        let walls = this.GetAvailablePoints(this.position, 1, cell => {
            return cell.payload.isWall && !cell.payload.isVisited;
        });
        if (walls.length > 0) {
            check = walls[0];
            payload = new Payload(false);
            this.positions.push({ checkPoint: this.position, clearPoint: check.clearPoint });
            this.MarkCell(check.checkPoint.x, check.checkPoint.y, payload);
        } else {
            payload = new Payload(false, true);
            if(this.positions.length == 0) {
                this.stage++;
                this.MarkCell(this.position.x, this.position.y, payload);
                return true;
            }
            check = this.positions.pop();
            this.MarkCell(this.position.x, this.position.y, payload);
        }
        let p = check.clearPoint;
        this.MarkCell(p.x, p.y, payload);
        this.position = check.checkPoint;
        return false;
    }
}