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

    static UIEvolve() {
        let stageDiv = document.getElementById("StageDiv");
        let res = false;
        if (fieldController.Evolve()) {
            clearInterval(playTimer);
            stageDiv.style.background = `#1dd12c`;
            setTimeout(() => {
                stageDiv.style.background = ``;
                playing = !playing;
                UIControl.TimeRangeClick();
            }, 1000);
            res = true;
        }
        fieldController.Draw();
        stageDiv.innerHTML = `<b>Stage: ${fieldController.stage}</b>`;
        return res;
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

        document.getElementById("EvolveButton").onclick = UIControl.UIEvolve;

        document.getElementById("HardResetButton").onclick = ev => {
            fieldController.HardReset();
        };
    }

    static TimeRangeClick = () => {
        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
        playing = !playing;
        if (playing) {
            playButton.style.backgroundColor = "#d0451b";
            playButton.textContent = "Stop";
            playTimer = setInterval(() => {
                for (let i = 0; i < speed; i++) {
                    if(UIControl.UIEvolve()) {
                        return;
                    }
                }
            }, 1000 / fps);
        } else {
            playButton.style.backgroundColor = "#32d01b";
            playButton.textContent = "Play";
            clearInterval(playTimer);
        }
    }

    static SpeedChange = () => {
        speed = +(<HTMLInputElement>document.getElementById('speedrange')).value;
        document.getElementById("speeddiv").innerHTML = `Speed: ${speed}`;
    }

    static InitTimeRange() {
        let timeCheckbox = <HTMLInputElement>document.getElementById('TimeCheckbox');
        let speedDiv = document.getElementById('timediv');
        let speedRange = <HTMLInputElement>document.getElementById('speedrange');
        timeCheckbox.onchange = () => {
            speedDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
        }
        speedRange.onchange = UIControl.SpeedChange;
        speedRange.onmousemove = (e) => {
            if (e.buttons) {
                UIControl.SpeedChange();
            }
        }

        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
        playButton.onclick = UIControl.TimeRangeClick;
    }
}