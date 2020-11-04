import P5 from "p5";

const makeSketch = (width: number, height: number) => (p5: P5) => {
  let prevX = width / 2;
  let prevY = height / 2;

  p5.setup = () => {
    p5.resizeCanvas(width, height);
    p5.background(255);
  };

  const drawLine = (seed_: number) => {
    const seed = Date.now() + seed_;
    const x =
      prevX + p5.lerp(-1, 1, p5.noise(seed)) * (1 + p5.noise(seed) * 200);
    const y =
      prevY +
      p5.lerp(-1, 1, p5.noise(seed + 500)) * (1 + p5.noise(seed + 1000) * 200);
    p5.fill(0, 20);
    p5.stroke(0, 3 + p5.noise(seed) * 100);
    p5.line(x, y, prevX, prevY);
    p5.noStroke();
    p5.fill(0, 100);
    p5.ellipse(x, y, p5.noise(Date.now()) * 3 + 1);
    p5.noFill();
    p5.stroke(0, 3 + p5.noise(seed) * 40);
    p5.ellipse(x, y, p5.noise(Date.now()) * 5 + 1);
    p5.ellipse(x, y, p5.noise(Date.now()) * 50 + 1);
    p5.ellipse(x, y, p5.noise(Date.now()) * 100 + 1);
    p5.ellipse(
      x + p5.noise(x) * 10,
      y + p5.noise(y) * 10,
      p5.noise(Date.now()) * 50 + 1
    );
    prevX = x;
    prevY = y;

    // reset
    if (x < 0 || x >= width) {
      prevX = width / 2;
    }

    if (y < 0 || y >= height) {
      prevY = height / 2;
    }
    console.log("draw", { x, y });
  };

  p5.draw = () => {
    p5.noLoop();
    for (let i = 0; i <= 1000; i++) {
      drawLine(0);
    }
  };
};

export default makeSketch;
