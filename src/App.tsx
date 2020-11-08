import React from "react";
import Canvas from "./Canvas";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="flex my-8 mx-16 space-between">
        <Canvas />
      </div>
    </div>
  );
};

export default App;
