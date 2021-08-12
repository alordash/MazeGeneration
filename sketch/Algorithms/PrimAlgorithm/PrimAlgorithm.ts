/// <reference path = "../../Field/Geometry.ts" />
/// <reference path = "../../Field/FieldController.ts" />

type CheckType = { checkPoint: Vec2, clearPoint: Vec2 };

class PrimAlgorithm extends FieldController {
    toCheck: Array<CheckType>;
    toProcess: Array<Cell>;

    MarkPosition(state = States.empty) {
        this.MarkCell(this.position.x, this.position.y, state);
    }

    constructor(canvasManager: CanvasManager, step: number, initialPosition: Vec2 = undefined) {
        super(canvasManager, step, initialPosition);
        this.MarkPosition();
        this.optionalReset = (hard: boolean = false) => {
            if (hard || !Calc.IsInside(this.position.x, this.position.y, this.cells)) {
                this.stage = 0;
                this.shrinkingCount = 0;
                this.carvingCount = 0;
                this.position = FieldController.GetSpawn(this.canvasManager.width, this.canvasManager.height, this.step);
                this.toCheck = this.GetAvailablePoints(this.position);
                this.MarkPosition();
            } else {
                this.toCheck = this.GetAllAvailablePoints();
            }
        }
        this.toCheck = this.GetAvailablePoints(this.position);
        this.toProcess = new Array<Cell>();
        this.stageActions = [
            this.Growing,
            this.Shrink,
            this.Carving,
            this.Shrink
        ];
        this.Draw();
    }

    Growing = () => {
        if (this.toCheck.length == 0) {
            this.stage++;
            return true;
        }
        let check = this.toCheck.popRandom();
        let p = check.checkPoint;
        let cell = this.cells[p.x][p.y];
        if (cell.state == States.empty) {
            this.Evolve();
            return;
        }
        this.MarkCell(p.x, p.y, States.empty);
        this.MarkCell(check.clearPoint.x, check.clearPoint.y, States.empty);

        this.toCheck.push(...this.GetAvailablePoints(p));
        return false;
    }

    shrinkingCount = 0;
    $maxShrinkingCount = 3;
    Shrinkable(p: Vec2) {
        let k = 0;
        for (const loc of FieldController.Directions) {
            let _p = p.Sum(loc.Mul(0.5));
            if (!Calc.IsInside(_p.x, _p.y, this.cells))
                continue;
            if (this.cells[_p.x][_p.y].state == States.empty) {
                k++;
                if (k > 1)
                    return false;
            }
        }
        return k <= 1;
    }

    Shrink = () => {
        if (this.shrinkingCount > this.$maxShrinkingCount) {
            this.shrinkingCount = 0;
            this.stage++;
            this.toProcess.splice(0);
            return true;
        }
        if (this.toProcess.length == 0) {
            this.shrinkingCount++;
            for (let x = 0; x < this.cells.length; x++) {
                for (let y = 0; y < this.cells[0].length; y++) {
                    let cell = this.cells[x][y];
                    if (cell.state == States.empty && this.Shrinkable(new Vec2(x, y))) {
                        this.toProcess.push(cell);
                    }
                }
            }
        }
        if (this.toProcess.length > 0) {
            const p = this.toProcess.pop().pos;
            this.MarkCell(p.x, p.y, States.wall);
        }
        return false;
    }

    carvingCount = 0;
    $maxCarvingCount = 3;
    Carvable(p: Vec2) {
        let k = 0;
        for (const loc of FieldController.NeighboursLocs) {
            let _p = p.Sum(loc);
            if (!Calc.IsInside(_p.x, _p.y, this.cells))
                continue;
            if (this.cells[_p.x][_p.y].state== States.empty) {
                k++;
                if (k >= 4)
                    return true;
            }
        }
        return k >= 4;
    }

    Carving = () => {
        if (this.carvingCount > this.$maxCarvingCount) {
            this.carvingCount = 0;
            this.stage++;
            this.toProcess.splice(0);
            return true;
        }
        if (this.toProcess.length == 0) {
            this.carvingCount++;
            for (let x = 0; x < this.cells.length; x++) {
                for (let y = 0; y < this.cells[0].length; y++) {
                    let cell = this.cells[x][y];
                    if (cell.state == States.wall && this.Carvable(new Vec2(x, y))) {
                        this.toProcess.push(cell);
                    }
                }
            }
        }
        if (this.toProcess.length > 0) {
            const p = this.toProcess.pop().pos;
            this.MarkCell(p.x, p.y, States.empty);
        }
        return false;
    }

    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
            this.HardReset();
        } else {
            while (this.stageActions[this.stage]()) {
                if (this.stage == this.stageActions.length) {
                    return true;
                }
            }
        }
        return false;
    }
}