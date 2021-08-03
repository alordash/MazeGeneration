/// <reference path ="Geometry.ts" />

class Payload {
    isWall: boolean;
    isVisited: boolean
    constructor(isWall = true, isVisited = false) {
        this.isWall = isWall;
        this.isVisited = isVisited;
    }

    Copy() {
        return new Payload(this.isWall);
    }

    private static _Default = new Payload(true);

    static get Default(): Payload {
        return this._Default.Copy();
    }
}

class Cell {
    pos: Vec2;
    payload: Payload;

    constructor(pos: Vec2, payload: Payload = Payload.Default) {
        this.pos = pos;
        this.payload = payload;
    }
}