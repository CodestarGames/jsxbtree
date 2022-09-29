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
            BTreeManager.getInstance().update(dt);
        }
        lastTime = time
        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
    treeManager.start(ExampleTree, 60, blackboard);

};

setTimeout(() => { main(); }, 2000)


