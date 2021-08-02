class CanvasManager {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this.p5 = new p5(() => { });
        (this.p5.setup = () => {
            let canvasElement = this.p5.createCanvas(this._width, this._height);
            canvasElement.style('border', '#000000')
                .style('borderStyle', 'solid')
                .style('border-width', '3px');
            let element = canvasElement.elt;
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
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
        this.reset();
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
        this.reset();
    }
}
document.getElementById("WidthInput").onchange = (ev) => {
};
document.getElementById("HeightInput");
let canvasManager;
function main() {
    canvasManager = new CanvasManager(parseInt(document.getElementById("WidthInput").value), parseInt(document.getElementById("HeightInput").value));
}
main();
//# sourceMappingURL=build.js.map