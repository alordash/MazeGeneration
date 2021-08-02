document.getElementById("WidthInput").onchange = (ev) => {
    canvasManager.width = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
};

document.getElementById("HeightInput").onchange = (ev) => {
    canvasManager.height = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
};

(<HTMLInputElement>document.getElementById("HeightInput"));