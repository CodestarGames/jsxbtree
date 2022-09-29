import {BTreeManager} from "jsxbtree";
import {ExampleTree} from "./ExampleTree";

const main = () => {

    let blackboard = {
        message: 'hello from the blackboard!'
    };

    let treeManager = BTreeManager.getInstance();

    let lastTime: number;
    function gameLoop(time: number) {
        if (lastTime != null) {
            const dt = time - lastTime;
            treeManager.update(dt);
        }
        lastTime = time;
        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop);
    treeManager.start(ExampleTree, 10, blackboard, "root");

};

setTimeout(() => { main(); }, 2000);


