/// <reference path = "../CanvasManager.ts"/>
/// <reference path = "Cell.ts"/>

type FieldType = Array<Array<Cell>>;

class FieldController {
    canvasManager: CanvasManager;
    private _step: number;
    cells: FieldType;

    Quantiz(v: number) {
        return Math.round(v / this._step);
    }

    constructor(canvasManager: CanvasManager, step: number) {
        this._step = step;
        this.canvasManager = canvasManager;
        this.canvasManager.sizeValuesProcessor = (v) => {
            return this.Quantiz(v) * this._step;
        }
        this.canvasManager.reset(true);
        this.cells = new Array<Array<Cell>>();
        this.reset();
    }

    reset() {
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
        this.draw();
    }

    draw() {
        let p = this.canvasManager.p5;
        for (let arr of this.cells) {
            for (let cell of arr) {
                let v = cell.payload.v;
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
        this.canvasManager.reset(true);
        this.reset();
    }
}