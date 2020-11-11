import P5 from "p5";

const SIZE = 180;
const SIZE_RATE = 0.9;
const VELOCITY = 0.04;
const VELOCITY_RATE = 4;
const CIRCLE_QTY = 20;
const DRAW_COUNT = 5000;
const STROKE_WEIGHT = 0.15;
const NOISE_STRENGTH = 0.000001;

type Point = [
  center: P5.Vector,
  length: number,
  radius: number,
  velocity: number
];

const drawPoint = (p: P5) => (getPointPosFn: typeof getPointPos) => (
  point: Point
) => () => {
  const [{ x, y }, length] = point;
  // p.circle(x, y, length * 2);
  const { x: x_, y: y_ } = getPointPosFn(p)(point)();
  p.line(x, y, x_, y_);
};

const getPointPos = (p: P5) => (point: Point) => (): P5.Vector => {
  const [{ x, y }, length, radius] = point;
  return p.createVector(p.cos(radius) * length + x, p.sin(radius) * length + y);
};

const updatePoint = (p: P5) => (point: Point) => (
  originPoint?: Point
): Point => {
  const [center, length, radius, velocity] = point;
  if (!originPoint) {
    return [center, length, radius + velocity, velocity];
  } else {
    const newCenter = getPointPos(p)(originPoint)();
    const noise = p.noise(newCenter.x, newCenter.y, p.random() * 100) * 2 - 1;
    const newVel = velocity + noise * NOISE_STRENGTH;
    return [newCenter, length, radius + velocity, newVel];
  }
};

const reproductPoint = (p: P5) => (getPointPosFn: typeof getPointPos) => (
  point: Point
) => (): Point => {
  const { x, y } = getPointPosFn(p)(point)();
  const [, length, radius, velocity] = point;
  return [
    p.createVector(x, y),
    length * SIZE_RATE,
    radius,
    velocity * VELOCITY_RATE,
  ];
};

const sketch = (width: number, height: number) => (p: P5) => {
  let windowCenter = p.createVector(0, 0);
  let point1: Point | undefined;
  let points: Point[] = [];
  p.setup = () => {
    p.resizeCanvas(width, height);
    windowCenter = p.createVector(width / 2, height / 2);
    point1 = [p.createVector(0, 0), SIZE, 0, VELOCITY];
    for (let i = 0; i <= CIRCLE_QTY; i++) {
      points.push(point1);
      point1 = reproductPoint(p)(getPointPos)(point1)();
    }
    p.background(230);
  };

  p.draw = () => {
    p.frameRate(24);
    // p.background(230);
    p.noLoop();
    p.noFill();
    p.strokeWeight(STROKE_WEIGHT);
    p.translate(windowCenter.x, windowCenter.y);

    const drawP = (point: Point) => (originPoint?: Point) => {
      originPoint && drawPoint(p)(getPointPos)(point)();
      return updatePoint(p)(point)(originPoint);
    };

    const draw = () => {
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          points[i] = drawP(points[i])();
        } else {
          points[i] = drawP(points[i])(points[i - 1]);
        }
      }
    };

    [...Array(DRAW_COUNT)].forEach((_) => {
      draw();
    });

    p.save(`p_${Date.now()}.jpg`);
    // p.save(`${p.frameCount}.jpg`);
  };
};

export default sketch;
