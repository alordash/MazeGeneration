/// <reference path ="Geometry.ts" />

class Payload {
    v: number;
    constructor(v: number) {
        this.v = v;
    }

    static Default = new Payload(100);
}

class Cell {
    pos: Vec2;
    payload: Payload;

    constructor(pos: Vec2, payload: Payload = new Payload(Math.random() * 255)) {
        this.pos = pos;
        this.payload = payload;
    }
}