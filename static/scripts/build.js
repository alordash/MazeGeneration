class Calc {
    static IsInside(x, y, a) {
        return a.length > 0 && 0 <= x && x < a.length && 0 <= y && y < a[0].length;
    }
    static IsPointInside(p, a) {
        return this.IsInside(p.x, p.y, a);
    }
    static Random(min, max) {
        if (min > max) {
            [min, max] = [max, min];
        }
        return Math.random() * (max - min) + min;
    }
    static IntRand(min, max) {
        return Math.round(Calc.Random(min, max));
    }
    static Shuffle(a) {
        let m = a.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [a[m], a[i]] = [a[i], a[m]];
        }
    }
    static Odd(v) {
        if ((v & 0b1) == 0) {
            if (v <= 0) {
                return ++v;
            }
            return --v;
        }
        return v;
    }
}
Array.prototype.popRandom = function () {
    let i = Calc.IntRand(0, this.length - 1);
    let v = this[i];
    this.splice(i, 1);
    return v;
};
class CanvasManager {
    constructor(width, height, p5) {
        this.sizeValuesProcessor = (v) => { return v; };
        this._width = width;
        this._height = height;
        this.p5 = p5;
    }
    Reset(processSizeValues = false) {
        if (processSizeValues) {
            this._width = this.sizeValuesProcessor(this._width);
            this._height = this.sizeValuesProcessor(this._height);
        }
        this.p5.resizeCanvas(this._width, this._height);
        this.p5.background(0);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(0);
    }
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = this.sizeValuesProcessor(v);
        this.Reset();
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = this.sizeValuesProcessor(v);
        this.Reset();
    }
}
let playTimer;
let playing = false;
let playStep = 50;
let speed = parseInt(document.getElementById('speedrange').value);
let speedDivision = 20;
class UIControl {
    static Init() {
        UIControl.InitInputs();
        UIControl.InitTimeRange();
        UIControl.CreateOptions();
    }
    static UIUpdate() {
        let stageDiv = document.getElementById("StageDiv");
        stageDiv.innerHTML = `<b>Stage: ${fieldController.stage}</b>`;
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
            }, Math.min(4000, Math.max(500, fieldController.cells.length * fieldController.cells[0].length / 2.178)));
            res = true;
        }
        if (update) {
            UIControl.UIUpdate();
        }
        return res;
    }
    static InitInputs() {
        document.getElementById("WidthInput").onchange = ev => {
            canvasManager.width = parseInt(document.getElementById("WidthInput").value);
            fieldController.Reset();
        };
        document.getElementById("HeightInput").onchange = ev => {
            canvasManager.height = parseInt(document.getElementById("HeightInput").value);
            fieldController.Reset();
        };
        document.getElementById("StepInput").onchange = ev => {
            fieldController.step = parseInt(document.getElementById("StepInput").value);
        };
        document.getElementById("EvolveButton").onclick = () => { UIControl.UIEvolve(); };
        document.getElementById("HardResetButton").onclick = ev => {
            fieldController.HardReset();
        };
    }
    static InitTimeRange() {
        let timeCheckbox = document.getElementById('TimeCheckbox');
        let speedDiv = document.getElementById('timediv');
        let speedRange = document.getElementById('speedrange');
        timeCheckbox.onchange = () => {
            speedDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
        };
        speedRange.onchange = UIControl.SpeedChange;
        speedRange.onmousemove = (e) => {
            if (e.buttons) {
                UIControl.SpeedChange();
            }
        };
        let playButton = document.getElementById('PlayButton');
        playButton.onclick = UIControl.TimeRangeClick;
    }
    static IdFormat(s) {
        return `${s}range`;
    }
    static NameFormat(s) {
        let letters = s.match(/[A-Z]/g);
        let parts = s.split(/[A-Z]/g);
        parts[0] = parts[0][0].toUpperCase() + parts[0].substring(1);
        for (let i = 1; i < parts.length; i++) {
            parts[i] = letters[i - 1].toLowerCase() + parts[i];
        }
        return parts.join(' ');
    }
    static CreateNumberParameter(fieldContoller, key) {
        const params = document.getElementById('Params');
        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(`${UIControl.NameFormat(key.substring(1))} `));
        let range = document.createElement("input");
        range.id = UIControl.IdFormat(key.substring(1));
        range.type = 'text';
        range.className = 'textInput';
        range.value = fieldContoller[key].toString();
        range.onchange = () => {
            fieldContoller[key] = +range.value;
        };
        range.onmousemove = (e) => {
            if (e.buttons) {
                fieldContoller[key] = +range.value;
            }
        };
        params.appendChild(range);
    }
    static CreateParametersPanel(fieldController) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return x.className == 'rangeParam';
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
            fieldController = new Algorithm(canvasManager, parseInt(document.getElementById("StepInput").value));
            UIControl.CreateParametersPanel(fieldController);
        };
        let stageDiv = document.getElementById('StageDiv');
        document.body.insertBefore(list, stageDiv);
    }
}
UIControl.TimeRangeClick = () => {
    let playButton = document.getElementById('PlayButton');
    playing = !playing;
    if (playing) {
        playButton.style.backgroundColor = "#d0451b";
        playButton.textContent = "Stop";
        let fps = Math.min(speed, speedDivision);
        playTimer = setInterval(() => {
            let end = Math.max(1, speed - speedDivision);
            for (let i = 0; i < end; i++) {
                if (UIControl.UIEvolve(i == (end - 1))) {
                    UIControl.UIUpdate();
                    return;
                }
            }
        }, 1000 / fps);
    }
    else {
        playButton.style.backgroundColor = "#32d01b";
        playButton.textContent = "Play";
        clearInterval(playTimer);
    }
};
UIControl.SpeedChange = () => {
    speed = +document.getElementById('speedrange').value;
    document.getElementById("speeddiv").innerHTML = `Speed: ${speed}`;
    if (playing) {
        UIControl.TimeRangeClick();
        UIControl.TimeRangeClick();
    }
};
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Sum(p) {
        return new Vec2(this.x + p.x, this.y + p.y);
    }
    Mul(k) {
        return new Vec2(this.x * k, this.y * k);
    }
}
var States;
(function (States) {
    States[States["empty"] = 0] = "empty";
    States[States["wall"] = 1] = "wall";
    States[States["visited"] = 2] = "visited";
})(States || (States = {}));
class Cell {
    constructor(pos, state = States.wall) {
        this.pos = pos;
        this.state = state;
    }
}
class FieldController {
    constructor(canvasManager, step, initialPosition = FieldController.GetSpawn(canvasManager.width, canvasManager.height, step)) {
        this.stage = 0;
        this.optionalReset = (hard = false) => { };
        this.canvasManager = canvasManager;
        this._step = step;
        this.position = initialPosition;
        this.canvasManager.sizeValuesProcessor = (v) => {
            return this.Quantiz(v) * this._step;
        };
        this.canvasManager.Reset(true);
        this.cells = new Array();
        this.Reset();
    }
    static GetSpawn(w, h, step) {
        let x = Calc.Odd(Calc.IntRand(1, Math.floor(w / step) - 1));
        let y = Calc.Odd(Calc.IntRand(1, Math.floor(h / step) - 1));
        return new Vec2(x, y);
    }
    Quantiz(v) {
        let q = Math.round(v / this._step);
        if ((q & 0b1) == 0) {
            q++;
        }
        return q;
    }
    Reset(hard = false) {
        let kx = this.Quantiz(this.canvasManager.width);
        let ky = this.Quantiz(this.canvasManager.height);
        let newCells = new Array(kx);
        for (let x = 0; x < kx; x++) {
            newCells[x] = new Array(ky);
            for (let y = 0; y < ky; y++) {
                if (Calc.IsInside(x, y, this.cells)) {
                    newCells[x][y] = this.cells[x][y];
                }
                else {
                    newCells[x][y] = new Cell(new Vec2(x, y));
                }
            }
        }
        this.cells = newCells;
        this.optionalReset(hard);
        this.Draw();
    }
    HardReset() {
        this.canvasManager.Reset(true);
        this.cells = new Array();
        this.Reset(true);
    }
    Palette(state) {
        let p5 = this.canvasManager.p5;
        switch (state) {
            case States.empty:
                p5.fill(255);
                break;
            case States.visited:
                p5.fill(0, 0, 255);
                break;
            case States.wall:
                p5.fill(0);
                break;
            default:
                break;
        }
    }
    DrawCell(cell) {
        this.Palette(cell.state);
        const p = cell.pos;
        this.canvasManager.p5.rect(p.x * this._step, p.y * this._step, this._step, this._step);
    }
    Draw() {
        let p = this.canvasManager.p5;
        for (let arr of this.cells) {
            for (let cell of arr) {
                this.DrawCell(cell);
            }
        }
    }
    MarkCell(x, y, state) {
        let cell = this.cells[x][y];
        cell.state = state;
        this.DrawCell(cell);
    }
    get step() {
        return this._step;
    }
    set step(v) {
        this._step = v;
        this.canvasManager.Reset(true);
        this.Reset();
    }
    GetAvailablePoints(p, count = -1, predicate = FieldController.DefaultPredicate) {
        let points = new Array();
        let order = new Array(FieldController.Directions.length);
        for (let i = 0; i < order.length; i++) {
            order[i] = i;
        }
        Calc.Shuffle(order);
        for (const i of order) {
            const direction = FieldController.Directions[i];
            let newPoint = p.Sum(direction);
            if (Calc.IsPointInside(newPoint, this.cells) && predicate(this.cells[newPoint.x][newPoint.y])) {
                points.push({ checkPoint: newPoint, clearPoint: p.Sum(direction.Mul(0.5)) });
                if (count != -1 && points.length >= count) {
                    return points;
                }
            }
        }
        return points;
    }
    GetAllAvailablePoints(predicate = FieldController.DefaultPredicate) {
        let points = new Array();
        for (let x = 1; x < this.cells.length; x += 2) {
            for (let y = 1; y < this.cells[0].length; y += 2) {
                if (this.cells[x][y].state != States.wall)
                    points.push(...this.GetAvailablePoints(new Vec2(x, y), undefined, predicate));
            }
        }
        return points;
    }
    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
            this.HardReset();
        }
        else {
            while (this.stageActions[this.stage]()) {
                if (this.stage == this.stageActions.length) {
                    return true;
                }
            }
        }
        return false;
    }
}
FieldController.paramMark = '$';
FieldController.Directions = [new Vec2(2, 0), new Vec2(0, -2), new Vec2(-2, 0), new Vec2(0, 2)];
FieldController.NeighboursLocs = [
    new Vec2(1, 0),
    new Vec2(1, -1),
    new Vec2(0, -1),
    new Vec2(-1, -1),
    new Vec2(-1, 0),
    new Vec2(-1, 1),
    new Vec2(0, 1),
    new Vec2(1, 1)
];
FieldController.DefaultPredicate = (cell) => { return cell.state == States.wall; };
class PrimAlgorithm extends FieldController {
    constructor(canvasManager, step, initialPosition = undefined) {
        super(canvasManager, step, initialPosition);
        this.Growing = () => {
            if (this.toCheck.length == 0) {
                this.stage++;
                return true;
            }
            let check = this.toCheck.popRandom();
            let p = check.checkPoint;
            let cell = this.cells[p.x][p.y];
            if (cell.state == States.empty) {
                this.Evolve();
                return;
            }
            this.MarkCell(p.x, p.y, States.empty);
            this.MarkCell(check.clearPoint.x, check.clearPoint.y, States.empty);
            this.toCheck.push(...this.GetAvailablePoints(p));
            return false;
        };
        this.shrinkingCount = 0;
        this.$maxShrinkingCount = 3;
        this.Shrink = () => {
            if (this.shrinkingCount > this.$maxShrinkingCount) {
                this.shrinkingCount = 0;
                this.stage++;
                this.toProcess.splice(0);
                return true;
            }
            if (this.toProcess.length == 0) {
                this.shrinkingCount++;
                for (let x = 0; x < this.cells.length; x++) {
                    for (let y = 0; y < this.cells[0].length; y++) {
                        let cell = this.cells[x][y];
                        if (cell.state == States.empty && this.Shrinkable(new Vec2(x, y))) {
                            this.toProcess.push(cell);
                        }
                    }
                }
            }
            if (this.toProcess.length > 0) {
                const p = this.toProcess.pop().pos;
                this.MarkCell(p.x, p.y, States.wall);
            }
            return false;
        };
        this.carvingCount = 0;
        this.$maxCarvingCount = 3;
        this.Carving = () => {
            if (this.carvingCount > this.$maxCarvingCount) {
                this.carvingCount = 0;
                this.stage++;
                this.toProcess.splice(0);
                return true;
            }
            if (this.toProcess.length == 0) {
                this.carvingCount++;
                for (let x = 0; x < this.cells.length; x++) {
                    for (let y = 0; y < this.cells[0].length; y++) {
                        let cell = this.cells[x][y];
                        if (cell.state == States.wall && this.Carvable(new Vec2(x, y))) {
                            this.toProcess.push(cell);
                        }
                    }
                }
            }
            if (this.toProcess.length > 0) {
                const p = this.toProcess.pop().pos;
                this.MarkCell(p.x, p.y, States.empty);
            }
            return false;
        };
        this.MarkPosition();
        this.optionalReset = (hard = false) => {
            if (hard || !Calc.IsInside(this.position.x, this.position.y, this.cells)) {
                this.stage = 0;
                this.shrinkingCount = 0;
                this.carvingCount = 0;
                this.position = FieldController.GetSpawn(this.canvasManager.width, this.canvasManager.height, this.step);
                this.toCheck = this.GetAvailablePoints(this.position);
                this.MarkPosition();
            }
            else {
                this.toCheck = this.GetAllAvailablePoints();
            }
        };
        this.toCheck = this.GetAvailablePoints(this.position);
        this.toProcess = new Array();
        this.stageActions = [
            this.Growing,
            this.Shrink,
            this.Carving,
            this.Shrink
        ];
        this.Draw();
    }
    MarkPosition(state = States.empty) {
        this.MarkCell(this.position.x, this.position.y, state);
    }
    Shrinkable(p) {
        let k = 0;
        for (const loc of FieldController.Directions) {
            let _p = p.Sum(loc.Mul(0.5));
            if (!Calc.IsInside(_p.x, _p.y, this.cells))
                continue;
            if (this.cells[_p.x][_p.y].state == States.empty) {
                k++;
                if (k > 1)
                    return false;
            }
        }
        return k <= 1;
    }
    Carvable(p) {
        let k = 0;
        for (const loc of FieldController.NeighboursLocs) {
            let _p = p.Sum(loc);
            if (!Calc.IsInside(_p.x, _p.y, this.cells))
                continue;
            if (this.cells[_p.x][_p.y].state == States.empty) {
                k++;
                if (k >= 4)
                    return true;
            }
        }
        return k >= 4;
    }
    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
            this.HardReset();
        }
        else {
            while (this.stageActions[this.stage]()) {
                if (this.stage == this.stageActions.length) {
                    return true;
                }
            }
        }
        return false;
    }
}
let canvasManager;
let fieldController;
var p5Sketch = (_p) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(parseInt(document.getElementById("WidthInput").value), parseInt(document.getElementById("HeightInput").value));
        let htmlElement = canvasElement.elt;
        document.getElementById('Editor').appendChild(htmlElement);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(0);
    };
};
let _p = new p5(p5Sketch);
function main() {
    const w = parseInt(document.getElementById("WidthInput").value);
    const h = parseInt(document.getElementById("HeightInput").value);
    const step = parseInt(document.getElementById("StepInput").value);
    canvasManager = new CanvasManager(w, h, _p);
    fieldController = new PrimAlgorithm(canvasManager, step);
    console.log('main done');
    fieldController.Draw();
    UIControl.Init();
    UIControl.CreateParametersPanel(fieldController);
}
setTimeout(main, 10);
class DeepFirstSearch extends FieldController {
    constructor(canvasManager, step, initialPosition = undefined) {
        super(canvasManager, step, initialPosition);
        this.Search = () => {
            let state;
            let check;
            let walls = this.GetAvailablePoints(this.position, 1, cell => {
                return cell.state == States.wall;
            });
            if (walls.length > 0) {
                state = States.empty;
                check = walls[0];
                this.positions.push({ checkPoint: this.position, clearPoint: check.clearPoint });
                this.MarkCell(check.checkPoint.x, check.checkPoint.y, state);
            }
            else {
                state = States.visited;
                if (this.positions.length == 0) {
                    this.stage++;
                    this.MarkCell(this.position.x, this.position.y, state);
                    return true;
                }
                check = this.positions.pop();
                this.MarkCell(this.position.x, this.position.y, state);
            }
            let p = check.clearPoint;
            this.MarkCell(p.x, p.y, state);
            this.position = check.checkPoint;
            return false;
        };
        this.positions = new Array();
        this.MarkPosition();
        this.optionalReset = (hard = false) => {
            if (hard || !Calc.IsInside(this.position.x, this.position.y, this.cells)) {
                this.stage = 0;
                this.position = FieldController.GetSpawn(this.canvasManager.width, this.canvasManager.height, this.step);
                this.positions = new Array();
                this.MarkPosition();
            }
        };
        this.stageActions = [
            this.Search
        ];
        this.Draw();
    }
    MarkPosition(state = States.empty) {
        this.MarkCell(this.position.x, this.position.y, state);
    }
}
const Algorithms_List = [
    PrimAlgorithm,
    DeepFirstSearch
];
//# sourceMappingURL=build.js.map