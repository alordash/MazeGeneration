let playTimer: NodeJS.Timer;
let playing = false;
let playStep = 50;

let speed = 1;
let speedDivision = 20;

const pause = 500;

abstract class UIControl {
    static Init() {
        UIControl.InitInputs();
        UIControl.InitTimeRange();
        UIControl.CreateOptions();
    }

    static UIEvolve(update = true) {
        let stageDiv = document.getElementById("StageDiv");
        let res = false;
        if (fieldController.Evolve()) {
            clearInterval(playTimer);
            stageDiv.style.background = `#1dd12c`;
            setTimeout(() => {
                stageDiv.style.background = ``;
                if (playing) {
                    UIControl.TimeRangeClick();
                    UIControl.TimeRangeClick();
                }
            }, pause);
            res = true;
        }
        if (update) {
            fieldController.Draw();
            stageDiv.innerHTML = `<b>Stage: ${fieldController.stage}</b>`;
        }
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

        document.getElementById("EvolveButton").onclick = () => { UIControl.UIEvolve(); };

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
            let fps = Math.min(speed, speedDivision);
            playTimer = setInterval(() => {
                let end = Math.max(1, speed - speedDivision);
                for (let i = 0; i < end; i++) {
                    if (UIControl.UIEvolve(i == (end - 1))) {
                        fieldController.Draw();
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
        if (playing) {
            UIControl.TimeRangeClick();
            UIControl.TimeRangeClick();
        }
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

    static IdFormat(s: string) {
        return `${s}range`;
    }

    static NameFormat(s: string) {
        let letters = s.match(/[A-Z]/g);
        let parts = s.split(/[A-Z]/g);
        parts[0] = parts[0][0].toUpperCase() + parts[0].substring(1);
        for (let i = 1; i < parts.length; i++) {
            parts[i] = letters[i - 1].toLowerCase() + parts[i];
        }
        return parts.join(' ');
    }

    static CreateNumberParameter(fieldContoller: FieldController, key: string) {
        const params = document.getElementById('Params');

        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(`${UIControl.NameFormat(key.substring(1))} `));
        //<input type="text" id="StepInput" value="30" class="textInput">
        let range = document.createElement("input");
        range.id = UIControl.IdFormat(key.substring(1));
        range.type = 'text';
        range.className = 'textInput';
        range.value = fieldContoller[key].toString();

        range.onchange = () => {
            fieldContoller[key] = +range.value;
        }
        range.onmousemove = (e) => {
            if (e.buttons) {
                fieldContoller[key] = +range.value;
            }
        }
        params.appendChild(range);
    }

    static CreateParametersPanel(fieldController: FieldController) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return (<HTMLElement>x).className == 'rangeParam';
        });
        for (let range of ranges) {
            range.remove();
        }
        document.getElementById('Params').innerHTML = `<b>Parameters</b>`;
        for (let [key, value] of Object.entries(fieldController)) {
            if (key[0] == FieldController.paramMark) {
                UIControl.CreateNumberParameter(fieldController, key);
            }
        }
    }

    static CreateOptions() {
        let list = document.createElement('select');
        list.className = 'options';
        for (let Algorithm of Algorithms_List) {
            let option = document.createElement('option');
            option.innerHTML = Algorithm.name;
            list.appendChild(option);
        }

        list.onchange = () => {
            let Algorithm = Algorithms_List.find((x) => { return x.name == list.value; });
            console.log('Algorithm.name :>> ', Algorithm.name);
            fieldController = new Algorithm(canvasManager, parseInt((<HTMLInputElement>document.getElementById("StepInput")).value));
            UIControl.CreateParametersPanel(fieldController);
        }

        let stageDiv = document.getElementById('StageDiv');
        document.body.insertBefore(list, stageDiv);
    }
}