class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Calc {
    static IsInside<T>(x: number, y: number, a: Array<Array<T>>) {
        return a.length > 0 && 0 <= x && x < a.length && 0 <= y && y < a[0].length;
    }
}