import P5 from "p5";

const drawlines = (p5: P5) => {
  let n = 0;
  return () => {
    n += 0.0001;
    const rad = p5.noise(n) * p5.PI * 4;
    const dir = p5.createVector(p5.sin(rad), p5.cos(rad));

    const center = p5.createVector(p5.width / 2, p5.height / 2);
    const to = dir.mult(100 + p5.noise(n * 100) * 10000).add(center);

    const pos = center.add(
      p5
        .createVector(
          p5.noise(n * 10) * 2 - 1,
          p5.noise(p5.noise(n * 10)) * 2 - 1
        )
        .mult(1)
    );
    p5.circle(to.x * 0.3, to.y * 0.3, p5.pow(p5.noise(n), 2) * 1000);
    // p5.line(pos.x, pos.y, to.x, to.y);
  };
};

const makeSketch = (width: number, height: number) => (p5: P5) => {
  let a_: any;
  p5.setup = () => {
    p5.resizeCanvas(width, height);
    p5.background(220);
    a_ = drawlines(p5);
  };

  // let n = 0;
  p5.draw = () => {
    p5.noLoop();
    p5.strokeWeight(0.01);
    p5.noFill();
    for (let i = 0; i <= 100000; i++) {
      a_();
    }

    // for (let i = 0; i <= 70000; i++) {
    // p5.strok/e(0);
    // b_();
    // }

    p5.save("20201107_p.jpg");
  };
};

export default makeSketch;
