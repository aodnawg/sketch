import P5 from "p5";

const drawLine = (p: P5) => (rad: number, x: number, y: number) => {
  const vec = p
    .createVector(p.sin(rad + p.PI / 2), p.cos(rad + p.PI / 2))
    .mult(1000)
    .add(x, y);

  const vec2 = p
    .createVector(p.sin(rad - p.PI / 2), p.cos(rad - p.PI / 2))
    .mult(1000)
    .add(x, y);
  p.line(vec.x, vec.y, vec2.x, vec2.y);
};

const drawCircle = (p: P5) => (
  length: number,
  center: P5.Vector,
  step: number,
  steps: number
) => {
  for (let i = 0; i < p.PI * 2; i += p.radians(360 / step)) {
    const x = p.sin(i) * length + center.x;
    const y = p.cos(i) * length + center.y;

    // for (let j = 0; j <= 1; j++) {
    drawLine(p)(i, x, y);
    // drawCircles(p)(p.createVector(x, y), length, steps - 1);
    // }
  }
};

const drawCircles = (p: P5) => (
  center: P5.Vector,
  length: number,
  steps: number
) => {
  if (steps < 3) return;
  for (let i = length; i > 0; i -= length / steps) {
    drawCircle(p)(i, center, 30, steps);
  }
};

const sketch = (width: number, height: number) => (p: P5) => {
  let center = p.createVector(0, 0);
  p.setup = () => {
    p.resizeCanvas(width, height);
    center = p.createVector(width / 2, height / 2);
    p.background(230);
  };

  p.draw = () => {
    p.noLoop();
    p.noFill();
    p.strokeWeight(0.2);
    drawCircles(p)(center, 500, 30);
    p.save();
  };
};

export default sketch;
