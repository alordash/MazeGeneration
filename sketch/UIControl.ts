document.getElementById("WidthInput").onchange = (ev) => {
    canvasManager.width = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
};

document.getElementById("HeightInput").onchange = (ev) => {
    canvasManager.height = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
};

document.getElementById("StepInput").onchange = (ev) => {
    fieldController.step = parseInt((<HTMLInputElement>document.getElementById("StepInput")).value);
};


(<HTMLInputElement>document.getElementById("HeightInput"));