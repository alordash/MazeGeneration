/// <reference path = "../CanvasManager.ts"/>
/// <reference path = "Cell.ts"/>

type FieldType = Array<Array<Cell>>;

class FieldController {
    static Directions = [new Vec2(2, 0), new Vec2(0, -2), new Vec2(-2, 0), new Vec2(0, 2)];
    
    canvasManager: CanvasManager;
    private _step: number;
    cells: FieldType;

    Quantiz(v: number) {
        let q = Math.round(v / this._step);
        if ((q & 0b1) == 0) {
            q++;
        }
        return q;
    }

    optionalReset = () => { };

    constructor(canvasManager: CanvasManager, step: number) {
        this._step = step;
        this.canvasManager = canvasManager;
        this.canvasManager.sizeValuesProcessor = (v) => {
            return this.Quantiz(v) * this._step;
        }
        this.canvasManager.Reset(true);
        this.cells = new Array<Array<Cell>>();
        this.Reset();
    }

    Reset() {
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
        this.optionalReset();
        this.Draw();
    }

    Draw() {
        let p = this.canvasManager.p5;
        for (let arr of this.cells) {
            for (let cell of arr) {
                let v = cell.payload.isWall ? 0 : 255;
                p.fill(v);
                p.stroke(v);
                p.rect(cell.pos.x * this._step, cell.pos.y * this._step, this._step, this._step);
            }
        }
    }

    public get step(): number {
        return this._step;
    }

    public set step(v: number) {
        this._step = v;
        this.canvasManager.Reset(true);
        this.Reset();
    }
}