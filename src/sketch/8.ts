import P5 from "p5";

type Shape = P5.Vector[];

const makePoint = (p: P5) => (radius: number) => (arg: number) => () => {
  return p.createVector(p.cos(arg), p.sin(arg)).mult(radius);
};

const makeShape = (p: P5) => (makePoint: (arg: number) => P5.Vector) => (
  radius: number
) => (center: P5.Vector) => (angleNum: number) => () => {
  const baseAngle = (p.PI * 2) / angleNum;
  const result = [...Array(angleNum)].map((_, i) => {
    const angle = baseAngle * i;
    return makePoint(angle).add(center);
  });
  return result;
};

const drawShape = (p: P5) => (points: P5.Vector[]) => {
  const length = points.length;
  points.forEach((point, idx, points) => {
    const nextP = points[(idx + 1) % length];
    p.line(point.x, point.y, nextP.x, nextP.y);
  });
};

const reproduceShape = (p: P5) =>
  /** @param amount ずらす量 */
  (amount: number) => (shape: Shape) => (noiseFactor: number) => () => {
    const length = shape.length;
    return shape.map((pnt, idx, shape) => {
      const nextP = shape[(idx + 1) % length];
      const dir = P5.Vector.sub(nextP, pnt).normalize();
      const amt = amount * 0.5 + p.random() * noiseFactor * 2;
      const result = P5.Vector.add(pnt, P5.Vector.mult(dir, amt));
      return result;
    });
  };

/** 再帰的に図形を描画 */
const drawShapeRecursively = (p: P5) => (shape: Shape) => (
  reproduceShapeFn: typeof reproduceShape
) => (noiseFactor: number) =>
  /** @param number 繰り返す量 */
  (count: number) => () => {
    if (count < 0) {
      return;
    }
    drawShape(p)(shape);
    const noise = p.noise(count) * noiseFactor;
    const amount = 2 + noise;
    const newShape = reproduceShapeFn(p)(amount)(shape)(noiseFactor)();
    drawShapeRecursively(p)(newShape)(reproduceShapeFn)(noiseFactor)(
      count - 1
    )();
  };

const drawGraph = (p: P5) => (radius: number) => (
  center: P5.Vector | undefined = p.createVector(0, 0)
) => (edge: number) => (noiseFactor: number) => (lineCount: number) => () => {
  const shape = makeShape(p)((arg: number) => makePoint(p)(radius)(arg)())(
    radius
  )(center)(edge)();
  drawShapeRecursively(p)(shape)(reproduceShape)(noiseFactor)(lineCount)();
};

const makePrimaryFunctions = (p: P5) => () => {
  const setup = (width: number) => (height: number) => (p: P5) => () => {
    p.resizeCanvas(width, height);
    p.background(230);

    p.noLoop();
    p.strokeWeight(0.2);
    p.noFill();
  };

  const draw = (p: P5) => () => {
    // const drawGlid = () => {
    //   const glid = 8;
    //   const glidSize = p.width / glid;
    //   const d = (x: number, y: number, n: number, f: number) =>
    //     drawGraph(p)(glidSize * 0.5 - 10)(p.createVector(x, y))(n)(f)(64)();

    //   for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //       const x = glidSize * j;
    //       const y = glidSize * i;
    //       d(x + glidSize * 0.5, y + glidSize * 0.5, j + 3, i / 2);
    //     }
    //   }
    // };

    drawGraph(p)(420)(p.createVector(p.width, p.height).mult(0.5))(32)(10)(
      400
    )();

    // p.save();
  };
  return { setup, draw };
};

const sketch = (width: number, height: number) => (p: P5) => {
  const { setup, draw } = makePrimaryFunctions(p)();
  p.setup = setup(width)(height)(p);
  p.draw = draw(p);
};

export default sketch;
