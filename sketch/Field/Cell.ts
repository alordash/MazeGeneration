/// <reference path ="Geometry.ts" />

enum States {
    empty,
    wall,
    visited
}

class Cell {
    pos: Vec2;
    state: States;

    constructor(pos: Vec2, state: States = States.wall) {
        this.pos = pos;
        this.state = state;
    }
}