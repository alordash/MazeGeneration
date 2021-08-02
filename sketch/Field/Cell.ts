/// <reference path ="Geometry.ts" />

class Payload {
    v: number;
    constructor(v: number) {
        this.v = v;
    }

    static Default = new Payload(0);
}

class Cell {
    pos: Vec2;
    payload: Payload;

    constructor(pos: Vec2, payload: Payload = Payload.Default) {
        this.pos = pos;
        this.payload = payload;
    }
}