let canvasManager: CanvasManager;

function main() {
    canvasManager = new CanvasManager(
        parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value),
        parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value),
    );
}

main();