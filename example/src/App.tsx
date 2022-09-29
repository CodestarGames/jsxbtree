import React from 'react';

import {ExampleTree} from "./ExampleTree";
import {BTreeManager} from "../dist";

const main = () => {

  let blackboard = {
    message: 'hello from the blackboard!'
  };

  let treeManager = BTreeManager.getInstance();

  let lastTime: number;
  function gameLoop(time: number) {
    if (lastTime != null) {
      const dt = time - lastTime;
      BTreeManager.getInstance().update(dt);
    }
    lastTime = time
    window.requestAnimationFrame(gameLoop)
  }

  window.requestAnimationFrame(gameLoop)
  treeManager.start(ExampleTree, 60, blackboard);

}

function App() {

  return (<div className="App"></div>);
}

export default App;
