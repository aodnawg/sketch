import P5 from "p5";

type Point = [
  center: P5.Vector,
  length: number,
  radius: number,
  velocity: number
];

// const makePointFromPoint = (p: P5) => (len: number, center: P5.Vector) => (
//   triangle: Triangle
// ): Periods => {
//   const periods: Periods = triangle.map(([radius]) => {
//     const x = p.sin(radius) * len + center.x;
//     const y = p.cos(radius) * len + center.y;
//     return p.createVector(x, y);
//   });
//   return periods;
// };

const drawPoint = (p: P5) => (getPointPosFn: typeof getPointPos) => (
  point: Point
) => () => {
  const [{ x, y }, length] = point;
  p.circle(x, y, length * 2);
  const { x: x_, y: y_ } = getPointPosFn(p)(point)();
  p.circle(x_, y_, 3);
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
    return [getPointPos(p)(originPoint)(), length, radius + velocity, velocity];
  }
};

const reproductPoint = (p: P5) => (getPointPosFn: typeof getPointPos) => (
  point: Point
) => (): Point => {
  const { x, y } = getPointPosFn(p)(point)();
  const [, length, radius, velocity] = point;
  return [p.createVector(x, y), length * 0.5, radius, velocity * 1.2];
};

const sketch = (width: number, height: number) => (p: P5) => {
  let windowCenter = p.createVector(0, 0);
  let point1: Point | undefined;
  let point2: Point | undefined;
  // let Points: Point[] | undefined;
  p.setup = () => {
    p.resizeCanvas(width, height);
    windowCenter = p.createVector(width / 2, height / 2);
    point1 = [p.createVector(0, 0), 250, 0, 0.01];
    point2 = reproductPoint(p)(getPointPos)(point1)();

    // point = reproductPoint(p)(getPointPos(p))(point)();
    // console.log(point2);
    p.background(230);
  };

  p.draw = () => {
    p.background(230);
    // p.noLoop();
    p.noFill();

    p.strokeWeight(0.3);

    p.translate(windowCenter.x, windowCenter.y);

    if (!point1 || !point2) {
      return;
    }

    const drawP = (point: Point) => (originPoint?: Point) => {
      drawPoint(p)(getPointPos)(point)();
      return updatePoint(p)(point)(originPoint);
    };

    // let point_ = [...point];
    // for (let i = 0; i <= 2; i++) {
    //   point = drawP(point)(reproductPoint(p)(getPointPos)(point)());
    //   console.log(point);
    // }
    point1 = drawP(point1)();
    point2 = drawP(point2)(point1);
    // point = point_;
    // const secondPoint: Point = makePointFromPoint(p)(getPointFn)(point)();
    // drawPoint(p)(getPointPos(p)(secondPoint))(secondPoint)();
  };
};

export default sketch;
