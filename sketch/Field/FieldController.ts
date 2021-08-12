/// <reference path = "../CanvasManager.ts"/>
/// <reference path = "Cell.ts"/>

type FieldType = Array<Array<Cell>>;

class FieldController {
    static GetSpawn(w: number, h: number, step: number) {
        let x = Calc.Odd(Calc.IntRand(1, Math.floor(w / step) - 1));
        let y = Calc.Odd(Calc.IntRand(1, Math.floor(h / step) - 1));
        return new Vec2(x, y);
    }

    static paramMark = '$';
    static Directions = [new Vec2(2, 0), new Vec2(0, -2), new Vec2(-2, 0), new Vec2(0, 2)];
    static NeighboursLocs = [
        new Vec2(1, 0),
        new Vec2(1, -1),
        new Vec2(0, -1),
        new Vec2(-1, -1),
        new Vec2(-1, 0),
        new Vec2(-1, 1),
        new Vec2(0, 1),
        new Vec2(1, 1)
    ];

    stage = 0;
    stageActions: Array<() => boolean>;

    canvasManager: CanvasManager;
    private _step: number;
    cells: FieldType;

    position: Vec2;

    Quantiz(v: number) {
        let q = Math.round(v / this._step);
        if ((q & 0b1) == 0) {
            q++;
        }
        return q;
    }

    optionalReset = (hard: boolean = false) => { };

    constructor(canvasManager: CanvasManager, step: number, initialPosition: Vec2 = FieldController.GetSpawn(canvasManager.width, canvasManager.height, step)) {
        this.canvasManager = canvasManager;
        this._step = step;
        this.position = initialPosition;
        this.canvasManager.sizeValuesProcessor = (v) => {
            return this.Quantiz(v) * this._step;
        }
        this.canvasManager.Reset(true);
        this.cells = new Array<Array<Cell>>();
        this.Reset();
    }

    Reset(hard = false) {
        let kx = this.Quantiz(this.canvasManager.width);
        let ky = this.Quantiz(this.canvasManager.height);

        let newCells = new Array<Array<Cell>>(kx);
        for (let x = 0; x < kx; x++) {
            newCells[x] = new Array<Cell>(ky);
            for (let y = 0; y < ky; y++) {
                if (Calc.IsInside(x, y, this.cells)) {
                    newCells[x][y] = this.cells[x][y];
                } else {
                    newCells[x][y] = new Cell(new Vec2(x, y));
                }
            }
        }
        this.cells = newCells;
        this.optionalReset(hard);
        this.Draw();
    }

    HardReset() {
        this.canvasManager.Reset(true);
        this.cells = new Array<Array<Cell>>();
        this.Reset(true);
    }

    Palette(state: States) {
        let p5 = this.canvasManager.p5;
        switch (state) {
            case States.empty:
                p5.fill(255);
                break;
            case States.visited:
                p5.fill(0, 0, 255);
                break;
            case States.wall:
                p5.fill(0);
                break;
            default:
                break;
        }
    }

    DrawCell(cell: Cell) {
        this.Palette(cell.state);
        const p = cell.pos;
        this.canvasManager.p5.rect(p.x * this._step, p.y * this._step, this._step, this._step);
    }

    Draw() {
        let p = this.canvasManager.p5;
        for (let arr of this.cells) {
            for (let cell of arr) {
                this.DrawCell(cell);
            }
        }
    }

    MarkCell(x: number, y: number, state: States) {
        let cell = this.cells[x][y];
        cell.state = state;
        this.DrawCell(cell);
    }

    public get step(): number {
        return this._step;
    }

    public set step(v: number) {
        this._step = v;
        this.canvasManager.Reset(true);
        this.Reset();
    }

    static DefaultPredicate = (cell: Cell) => { return cell.state == States.wall; };

    GetAvailablePoints(p: Vec2, count = -1, predicate = FieldController.DefaultPredicate) {
        let points = new Array<CheckType>();
        let order = new Array<number>(FieldController.Directions.length);
        for (let i = 0; i < order.length; i++) {
            order[i] = i;
        }
        Calc.Shuffle(order);
        for (const i of order) {
            const direction = FieldController.Directions[i];
            let newPoint = p.Sum(direction);
            if (Calc.IsPointInside(newPoint, this.cells) && predicate(this.cells[newPoint.x][newPoint.y])) {
                points.push({ checkPoint: newPoint, clearPoint: p.Sum(direction.Mul(0.5)) });
                if (count != -1 && points.length >= count) {
                    return points;
                }
            }
        }
        return points;
    }

    GetAllAvailablePoints(predicate = FieldController.DefaultPredicate) {
        let points = new Array<CheckType>();
        for (let x = 1; x < this.cells.length; x += 2) {
            for (let y = 1; y < this.cells[0].length; y += 2) {
                if (this.cells[x][y].state != States.wall)
                    points.push(...this.GetAvailablePoints(new Vec2(x, y), undefined, predicate));
            }
        }
        return points;
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