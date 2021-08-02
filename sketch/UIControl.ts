document.getElementById("WidthInput").onchange = ev => {
    canvasManager.width = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
    fieldController.Reset();
};

document.getElementById("HeightInput").onchange = ev => {
    canvasManager.height = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
    fieldController.Reset();
};

document.getElementById("StepInput").onchange = ev => {
    fieldController.step = parseInt((<HTMLInputElement>document.getElementById("StepInput")).value);
};

document.getElementById("EvolveButton").onclick = ev => {
    fieldController.Evolve();
    fieldController.Draw();
};

(<HTMLInputElement>document.getElementById("HeightInput"));