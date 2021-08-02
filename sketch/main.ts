/// <reference path="CanvasManager.ts" />
/// <reference path="UIControl.ts" />
/// <reference path="Field/FieldController.ts" />

let canvasManager: CanvasManager;
let fieldController: FieldController;

var p5Sketch = (_p: p5) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value), parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value));
        let htmlElement = <HTMLElement>canvasElement.elt;
        document.getElementById('Editor').appendChild(htmlElement);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };
};

let _p = new p5(p5Sketch);

function main() {
    canvasManager = new CanvasManager(
        parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value),
        parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value),
        _p
    );

    fieldController = new FieldController(canvasManager, parseInt((<HTMLInputElement>document.getElementById("StepInput")).value));
}

setTimeout(main, 10);