class CanvasManager {
    private _width: number;
    private _height: number;
    p5: p5;
    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.p5 = new p5(() => { });
        (this.p5.setup = () => {
            let canvasElement = this.p5.createCanvas(this._width, this._height);
            canvasElement.style('border', '#000000')
                .style('borderStyle', 'solid')
                .style('border-width', '3px');
            let element = <HTMLElement>canvasElement.elt;
            document.getElementById('Editor').appendChild(element);
            this.reset();
        })();
    }

    reset() {
        this.p5.resizeCanvas(this._width, this._height);
        this.p5.background(225, 225, 255);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(2);
    }

    public get width(): number {
        return this._width;
    }

    public set width(v: number) {
        this._width = v;
        this.reset();
    }

    public get height(): number {
        return this._height;
    }

    public set height(v: number) {
        this._height = v;
        this.reset();
    }
}