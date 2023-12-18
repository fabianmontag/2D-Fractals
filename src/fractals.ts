interface Vec2 {
    x: number;
    y: number;
}

export const KochRectangle = (ctx: CanvasRenderingContext2D, p1: Vec2, p2: Vec2, n: number) => {
    if (n == 0) return;

    const d1 = { x: p1.x + (1 / 3) * (p2.x - p1.x), y: p1.y + (1 / 3) * (p2.y - p1.y) };
    const d2 = { x: p1.x + (2 / 3) * (p2.x - p1.x), y: p1.y + (2 / 3) * (p2.y - p1.y) };

    function rotate(cx: number, cy: number, x: number, y: number, angle: number) {
        const radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = cos * (x - cx) + sin * (y - cy) + cx,
            ny = cos * (y - cy) - sin * (x - cx) + cy;
        return { x: nx, y: ny };
    }

    const r = 90;

    const d3 = rotate(d1.x, d1.y, d2.x, d2.y, r);
    const d4 = rotate(d2.x, d2.y, d1.x, d1.y, -r);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(d1.x, d1.y);
    ctx.lineTo(d3.x, d3.y);
    ctx.lineTo(d4.x, d4.y);
    ctx.lineTo(d2.x, d2.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();

    KochRectangle(ctx, p1, d1, n - 1);
    KochRectangle(ctx, d1, d3, n - 1);
    KochRectangle(ctx, d3, d4, n - 1);
    KochRectangle(ctx, d4, d2, n - 1);
    KochRectangle(ctx, d2, p2, n - 1);
};

export const SierpinskiCarpet = (ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2, c: Vec2, d: Vec2, n: number) => {
    if (n == 0) return;

    const p1 = { x: a.x + (b.x - a.x) * (1 / 3), y: a.y + (d.y - a.y) * (2 / 3) };
    const p2 = { x: a.x + (b.x - a.x) * (2 / 3), y: a.y + (d.y - a.y) * (2 / 3) };
    const p3 = { x: a.x + (b.x - a.x) * (2 / 3), y: a.y + (d.y - a.y) * (1 / 3) };
    const p4 = { x: a.x + (b.x - a.x) * (1 / 3), y: a.y + (d.y - a.y) * (1 / 3) };

    const s1 = { x: a.x, y: a.y + (d.y - a.y) * (1 / 3) };
    const s2 = { x: a.x, y: a.y + (d.y - a.y) * (2 / 3) };

    const s3 = { x: a.x + (b.x - a.x) * (1 / 3), y: a.y };
    const s4 = { x: a.x + (b.x - a.x) * (2 / 3), y: a.y };

    const s5 = { x: b.x, y: a.y + (d.y - a.y) * (2 / 3) };
    const s6 = { x: b.x, y: a.y + (d.y - a.y) * (1 / 3) };

    const s7 = { x: a.x + (b.x - a.x) * (1 / 3), y: c.y };
    const s8 = { x: a.x + (b.x - a.x) * (2 / 3), y: c.y };

    if (n == 1) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.fill();
        ctx.closePath();
    }

    SierpinskiCarpet(ctx, s2, p1, s7, d, n - 1);
    SierpinskiCarpet(ctx, p1, p2, s8, s7, n - 1);
    SierpinskiCarpet(ctx, p2, s5, c, s8, n - 1);
    SierpinskiCarpet(ctx, p3, s6, s5, p2, n - 1);
    SierpinskiCarpet(ctx, s4, b, s6, p3, n - 1);
    SierpinskiCarpet(ctx, s3, s4, p3, p4, n - 1);
    SierpinskiCarpet(ctx, a, s3, p4, s1, n - 1);
    SierpinskiCarpet(ctx, s1, p4, p1, s2, n - 1);
};

export const SierpinskiTriangle = (ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2, c: Vec2, d: Vec2, n: number) => {
    if (n == 0) return;

    let p1: Vec2 = { x: (a.x + b.x) * 0.5, y: a.y };
    let z: Vec2 = { x: (c.x + d.x) * 0.5, y: c.y };

    let p2: Vec2 = { x: a.x + (z.x - a.x) * 0.5, y: a.y + (z.y - a.y) * 0.5 };

    let p3: Vec2 = { x: b.x + (z.x - b.x) * 0.5, y: b.y + (z.y - b.y) * 0.5 };

    if (n == 1) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        ctx.closePath();
    }

    let a1 = [a, p1, { x: p1.x, y: (a.y + d.y) * 0.5 }, { x: a.x, y: (a.y + d.y) * 0.5 }];

    SierpinskiTriangle(ctx, a1[0], a1[1], a1[2], a1[3], n - 1);

    let a2 = [p1, b, { x: b.x, y: (b.y + c.y) * 0.5 }, { x: p1.x, y: (b.y + c.y) * 0.5 }];

    SierpinskiTriangle(ctx, a2[0], a2[1], a2[2], a2[3], n - 1);

    let a3 = [p2, p3, { x: p3.x, y: c.y }, { x: p2.x, y: d.y }];

    SierpinskiTriangle(ctx, a3[0], a3[1], a3[2], a3[3], n - 1);
};

export const KochSnowFlake = (ctx: CanvasRenderingContext2D, n: number, a: Vec2, b: Vec2) => {
    let k = 3;
    if (n == 0) return;

    let [dx, dy] = [b.x - a.x, b.y - a.y];
    let dist = Math.sqrt(dx * dx + dy * dy);
    let unit = dist / k;
    let angle = Math.atan2(dy, dx);

    let p1 = {
        x: a.x + dx / k,
        y: a.y + dy / k,
    };
    let p3 = {
        x: b.x - dx / k,
        y: b.y - dy / k,
    };
    let p2 = {
        x: p1.x + Math.cos(angle - Math.PI / k) * unit,
        y: p1.y + Math.sin(angle - Math.PI / k) * unit,
    };

    if (n == 1) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    KochSnowFlake(ctx, n - 1, a, p1);
    KochSnowFlake(ctx, n - 1, p1, p2);
    KochSnowFlake(ctx, n - 1, p2, p3);
    KochSnowFlake(ctx, n - 1, p3, b);
};

let rand = () => {
    return ((Math.round(Math.random()) % 2 == 0 ? -1 : 1) * Math.floor(Math.random() * 20) * Math.PI) / 180;
};

export const Tree = (ctx: CanvasRenderingContext2D, n: number, l: number, k: number, deg: number, randomize: boolean) => {
    if (n == 0) return;

    let modL = l / k;

    ctx.save();

    ctx.rotate(deg + (randomize ? rand() : 0));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, l);
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, l);
    Tree(ctx, n - 1, modL, k, deg, randomize);
    ctx.restore();

    ctx.save();

    ctx.rotate(-deg + (randomize ? rand() : 0));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, l);
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, l);
    Tree(ctx, n - 1, modL, k, deg, randomize);
    ctx.restore();
};
