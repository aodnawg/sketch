import P5 from "p5";

type Periods = P5.Vector[];
type Triangle = [radius: number, velocity: number][];

const VELOCITY = 0.1;

const makeTriangle = (p: P5) => (
  len: number,
  center: P5.Vector
) => (): Triangle => {
  const rads = [...Array(3)].map((_) => p.random() * p.PI * 2);
  const trianle: Triangle = rads.map((r) => [r, p.random() * VELOCITY]);
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

const updateTriangle = (p: P5) => (triangle: Triangle): Triangle => {
  return triangle.map(([radius, velocity]) => [
    radius + velocity,
    velocity + p.noise(velocity) * 0.02 - 0.01, // ココ楽しい
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

const sketch = (width: number, height: number) => (p: P5) => {
  let center = p.createVector(0, 0);
  let triangle: Triangle | undefined;
  const len = 400;
  p.setup = () => {
    p.resizeCanvas(width, height);
    center = p.createVector(width / 2, height / 2);
    p.background(230);

    const makeTriangleFn = makeTriangle(p)(len, center);
    triangle = makeTriangleFn();
  };

  p.draw = () => {
    p.noLoop();
    // p.noFill();
    const w = p.pow(p.noise(p.frameCount * 0.02) * 0.5, 1.5);
    p.strokeWeight(w);

    p.fill(0);

    if (!triangle) {
      return;
    }

    [...Array(2000)].forEach(
      (_) =>
        (triangle = updateTriangle(p)(
          drawTriangle(p)(makePeriodsFromTriangle(p)(len, center))(triangle!)
        ))
    );
    p.save(`p_${Date.now()}.jpg`);
  };
};

export default sketch;
