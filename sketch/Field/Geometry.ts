class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    Sum(p: Vec2) {
        return new Vec2(this.x + p.x, this.y + p.y);
    }

    Mul(k: number) {
        return new Vec2(this.x * k, this.y * k);
    }
}