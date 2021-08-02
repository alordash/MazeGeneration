/// <reference path = "../Field/Geometry.ts" />
/// <reference path = "../Field/FieldController.ts" />

type CheckType = { checkPoint: Vec2, clearPoint: Vec2 };

class PrimAlgorithm extends FieldController {
    static GetSpawn(w: number, h: number, step: number) {
        let x = Calc.Odd(Calc.IntRand(1, Math.floor(w / step) - 1));
        let y = Calc.Odd(Calc.IntRand(1, Math.floor(h / step) - 1));
        return new Vec2(x, y);
    }

    stage = 0;

    private static _SpawnPayload = new Payload(false);
    static get SpawnPayload() {
        return PrimAlgorithm._SpawnPayload.Copy();
    }

    spawn: Vec2;
    toCheck: Array<CheckType>;

    MarkSpawn(payload: Payload = PrimAlgorithm.SpawnPayload) {
        this.cells[this.spawn.x][this.spawn.y].payload = payload;
    }

    constructor(canvasManager: CanvasManager, step: number, spawn: Vec2 = PrimAlgorithm.GetSpawn(canvasManager.width, canvasManager.height, step)) {
        super(canvasManager, step);
        this.spawn = spawn;
        this.cells[this.spawn.x][this.spawn.y].payload = PrimAlgorithm.SpawnPayload;
        this.optionalReset = () => {
            if (!Calc.IsInside(this.spawn.x, this.spawn.y, this.cells)) {
                this.spawn = PrimAlgorithm.GetSpawn(this.canvasManager.width, this.canvasManager.height, this.step);
                this.toCheck = this.GetAvailablePoints(this.spawn);
                this.MarkSpawn();
            } else {
                this.toCheck = this.GetAllAvailablePoints();
            }
        }
        this.toCheck = this.GetAvailablePoints(this.spawn);
        this.Draw();
    }

    GetAvailablePoints(p: Vec2) {
        let points = new Array<CheckType>();
        let order = new Array<number>(FieldController.Directions.length);
        for (let i = 0; i < order.length; i++) {
            order[i] = i;
        }
        Calc.Shuffle(order);
        for (const i of order) {
            const direction = FieldController.Directions[i];
            let newPoint = p.Sum(direction);
            if (Calc.IsPointInside(newPoint, this.cells) && this.cells[newPoint.x][newPoint.y].payload.isWall) {
                points.push({ checkPoint: newPoint, clearPoint: p.Sum(direction.Mul(0.5)) });
            }
        }
        return points;
    }

    GetAllAvailablePoints() {
        let points = new Array<CheckType>();
        for (let x = 1; x < this.cells.length; x += 2) {
            for (let y = 1; y < this.cells[0].length; y += 2) {
                if (!this.cells[x][y].payload.isWall)
                    points.push(...this.GetAvailablePoints(new Vec2(x, y)));
            }
        }
        return points;
    }

    shrinkingCount = 0;
    maxShrinkingCount = 3;
    Shrinkable(p: Vec2) {
        let k = 0;
        for (const loc of FieldController.Directions) {
            let _p = p.Sum(loc.Mul(0.5));
            if (!this.cells[_p.x][_p.y].payload.isWall) {
                k++;
                if (k > 1)
                    return false;
            }
        }
        return k <= 1;
    }

    stageActions = [
        () => {
            if (this.toCheck.length == 0) {
                this.stage++;
                return;
            }
            let index = Calc.IntRand(0, this.toCheck.length - 1);
            let check = this.toCheck[index];
            this.toCheck.splice(index, 1);
            let p = check.checkPoint;
            let cell = this.cells[p.x][p.y];
            if (!cell.payload.isWall) {
                this.Evolve();
                return;
            }
            cell.payload.isWall = this.cells[check.clearPoint.x][check.clearPoint.y].payload.isWall = false;

            this.toCheck.push(...this.GetAvailablePoints(p));
        }, () => {
            if (this.shrinkingCount >= this.maxShrinkingCount) {
                this.stage++;
                return;
            }
            this.shrinkingCount++;
            let toShrink = new Array<Cell>();
            for (let x = 0; x < this.cells.length; x++) {
                for (let y = 0; y < this.cells[0].length; y++) {
                    let cell = this.cells[x][y];
                    if (!cell.payload.isWall && this.Shrinkable(new Vec2(x, y))) {
                        toShrink.push(cell);
                    }
                }
            }
            for(let cell of toShrink) {
                cell.payload.isWall = true;
            }
        }
    ]

    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
        } else {
            this.stageActions[this.stage]();
        }
    }
}