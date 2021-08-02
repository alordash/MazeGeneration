let playTimer: NodeJS.Timer;
let playing = false;
let playStep = 50;

let time = 6;
let fps = 10;
let speed = 1;

abstract class UIControl {
    static Init() {
        UIControl.InitInputs();
        UIControl.InitTimeRange();
    }

    static InitInputs() {
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

        document.getElementById("HardResetButton").onclick = ev => {
            fieldController.HardReset();
        };
    }

    static InitTimeRange() {
        let timeCheckbox = <HTMLInputElement>document.getElementById('TimeCheckbox');
        let speedDiv = document.getElementById('speeddiv');
        let speedRange = <HTMLInputElement>document.getElementById('speedrange');
        timeCheckbox.onchange = () => {
            speedDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
        }
        speedRange.onchange = () => {
            speed = +speedRange.value;
        }
        speedRange.onmousemove = (e) => {
            if (e.buttons) {
                speed = +speedRange.value;
            }
        }

        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
        playButton.onclick = () => {
            playing = !playing;
            if (playing) {
                playButton.style.backgroundColor = "#d0451b";
                playButton.textContent = "Stop";
                playTimer = setInterval(() => {
                    for(let i = 0; i < speed; i++) {
                        fieldController.Evolve();
                        fieldController.Draw();
                    }
                }, 1000 / fps);
            } else {
                playButton.style.backgroundColor = "#32d01b";
                playButton.textContent = "Play";
                clearInterval(playTimer);
            }
        }
    }
}