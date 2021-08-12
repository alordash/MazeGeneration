/// <reference path="CanvasManager.ts" />
/// <reference path="UIControl.ts" />
/// <reference path="Field/FieldController.ts" />
/// <reference path="Algorithms/PrimAlgorithm/PrimAlgorithm.ts" />

let canvasManager: CanvasManager;
let fieldController: FieldController;

var p5Sketch = (_p: p5) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value), parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value));
        let htmlElement = <HTMLElement>canvasElement.elt;
        document.getElementById('Editor').appendChild(htmlElement);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(0);
    };
};

let _p = new p5(p5Sketch);

function main() {
    const w = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
    const h = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
    const step = parseInt((<HTMLInputElement>document.getElementById("StepInput")).value);
    canvasManager = new CanvasManager(w, h, _p);

    fieldController = new PrimAlgorithm(canvasManager, step);
    console.log('main done');
    fieldController.Draw();

    UIControl.Init();
    UIControl.CreateParametersPanel(fieldController);
}

setTimeout(main, 10);