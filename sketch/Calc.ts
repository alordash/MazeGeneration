class Calc {
    static IsInside<T>(x: number, y: number, a: Array<Array<T>>) {
        return a.length > 0 && 0 <= x && x < a.length && 0 <= y && y < a[0].length;
    }

    static IsPointInside<T>(p: Vec2, a: Array<Array<T>>) {
        return this.IsInside(p.x, p.y, a);
    }

    static Random(min: number, max: number) {
        if (min > max) {
            [min, max] = [max, min];
        }
        return Math.random() * (max - min) + min;
    }

    static IntRand(min: number, max: number) {
        return Math.round(Calc.Random(min, max));
    }

    static Shuffle<T>(a: Array<T>) {
        let m = a.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [a[m], a[i]] = [a[i], a[m]];
        }
    }

    static Odd(v: number) {
        if ((v & 0b1) == 0) {
            if (v <= 0) {
                return ++v;
            }
            return --v;
        }
        return v;
    }
}