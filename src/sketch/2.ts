import { notStrictEqual } from "assert";
import { randomBytes } from "crypto";
import P5 from "p5";

const makeSketch = (width: number, height: number) => (p5: P5) => {
  p5.setup = () => {
    p5.resizeCanvas(width, height);
    p5.background(255);
  };

  const run = (seed: number) => {
    let n = seed;
    return () => {
      p5.noStroke();
      p5.fill(p5.noise(n), 1 * p5.noise(n));
      n += 0.001;
      p5.circle(
        width / 2 + p5.sin(n) * p5.noise(n) * 500,
        height / 2 + p5.cos(n) * p5.noise(n) * 500,
        p5.noise(n) * 20
      );
    };
  };

  const list = [...Array(100)].map((_) => {
    return run(p5.random() * 1000);
  });
  p5.draw = () => {
    p5.noLoop();
    for (let i = 0; i <= 36000; i++) {
      list.forEach((l) => l());
    }

    p5.save();
  };
};

export default makeSketch;
