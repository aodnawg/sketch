import React, { useEffect, useRef } from "react";
import P5 from "p5";

import makeSketch from "./sketch/1";

interface useP5Param {
  height: number;
  width: number;
}

const useP5 = ({ height, width }: useP5Param) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const p5 = new P5(makeSketch(width, height), ref.current);
    console.log(p5);
    return () => {
      p5.remove();
    };
  }, []);

  return ref;
};

const Canvas: React.FC = () => {
  const width = 800;
  const height = 450;
  const ref = useP5({ width, height });
  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return <div style={style} ref={ref}></div>;
};

export default Canvas;
