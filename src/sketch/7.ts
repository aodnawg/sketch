import P5 from "p5";

type Periods = P5.Vector[];
type Triangle = [radius: number, velocity: number][];

const VELOCITY = 5000;
const COL_X = 10;

const makeTriangle = (p: P5) => (len: number) => (center: P5.Vector) => (
  noiseFactor: P5.Vector
) => (): Triangle => {
  // 円の中心とx軸がなす角度
  const rads = [...Array(3)].map((_) => p.random() * p.PI * 2);
  const v = noiseFactor.x * VELOCITY;
  const trianle: Triangle = rads.map((r) => [r, v]);
  return trianle;
};

const makePeriodsFromTriangle = (p: P5) => (len: number, center: P5.Vector) => (
  triangle: Triangle
): Periods => {
  const periods: Periods = triangle.map(([radius]) => {
    const x = p.sin(radius) * len + center.x;
    const y = p.cos(radius) * len + center.y;
    return p.createVector(x, y);
  });
  return periods;
};

const updateTriangle = (p: P5) => (noiseFactor: P5.Vector) => (
  triangle: Triangle
) => (): Triangle => {
  const factor = noiseFactor.y * 0.001;
  return triangle.map(([radius, velocity]) => [
    radius + velocity,
    velocity + p.noise(velocity) * factor * 2 - factor, // ココ楽しい
    // velocity
  ]);
};

const drawTriangle = (p: P5) => (
  makePeriodsFromTriangle: (triangle: Triangle) => Periods
) => (triangle: Triangle): Triangle => {
  const periods = makePeriodsFromTriangle(triangle);
  p.line(periods[0].x, periods[0].y, periods[1].x, periods[1].y);
  p.line(periods[1].x, periods[1].y, periods[2].x, periods[2].y);
  p.line(periods[2].x, periods[2].y, periods[0].x, periods[0].y);
  return triangle;
};

const drawCircle = (p: P5) => (
  updateTriangle: (arg: Triangle) => () => Triangle
) => (len: number) => (center: P5.Vector) => (triangle: Triangle) => () => {
  const fn = drawTriangle(p)(makePeriodsFromTriangle(p)(len, center));
  [...Array(500)].forEach((_) => (triangle = updateTriangle(fn(triangle))()));
};

const sketch = (width: number, height: number) => (p: P5) => {
  let center = p.createVector(0, 0);
  const triangles: Triangle[] = [];
  const len = 400;
  p.setup = () => {
    p.resizeCanvas(width, height);
    center = p.createVector(width / 2, height / 2);
    p.background(230);

    const makeTriangleFn = (noiseFactor: P5.Vector) =>
      makeTriangle(p)(len)(center)(noiseFactor)();
    [...Array(COL_X * COL_X)].forEach((i) => {
      const noiseFactor = p.createVector(i % COL_X, 0);
      const t = makeTriangleFn(noiseFactor);
      triangles.push(t);
    });

    console.log("triangles", triangles);
  };

  p.draw = () => {
    p.noLoop();
    p.strokeWeight(0.01);

    p.fill(0);
    const size = p.width / 2 / COL_X;
    p.translate(size, size);
    for (let i = 0; i < COL_X; i++) {
      for (let j = 0; j < COL_X; j++) {
        p.push();
        p.translate((p.width / COL_X) * i, (p.height / COL_X) * j);
        const center = p.createVector(0, 0);
        const noiseFactor = p.createVector(p.noise(i), p.noise(j));
        const idx = i * COL_X + j;
        const triangle = triangles[idx];
        if (idx % 2 === 0) {
          p.stroke(0);
        } else {
          p.stroke(1);
        }
        const size = p.width / 2 / COL_X - 10;
        drawCircle(p)(updateTriangle(p)(noiseFactor))(
          size * p.noise(noiseFactor.x, noiseFactor.y) * 10
        )(center)(triangle)();
        p.pop();
      }
    }

    p.save();
  };
};

export default sketch;
