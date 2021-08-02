

class CanvasManager {
    private _width: number;
    private _height: number;
    p5: p5;

    sizeValuesProcessor = (v: number) => { return v; };

    constructor(width: number, height: number, p5: p5) {
        this._width = width;
        this._height = height;
        this.p5 = p5;
    }

    reset(processSizeValues = false) {
        if (processSizeValues) {
            this._width = this.sizeValuesProcessor(this._width);
            this._height = this.sizeValuesProcessor(this._height);
        }
        this.p5.resizeCanvas(this._width, this._height);
        this.p5.background(0);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(2);
    }

    public get width(): number {
        return this._width;
    }

    public set width(v: number) {
        this._width = this.sizeValuesProcessor(v);
        this.reset();
    }

    public get height(): number {
        return this._height;
    }

    public set height(v: number) {
        this._height = this.sizeValuesProcessor(v);
        this.reset();
    }
}