import jsx from '../'
import ActionConsoleLog from "./ActionConsoleLog";
import BTreeManager from "../BTreeManager";

function TestTree (props) {
    return (
        <selector {...props}>
            <sequence while={(blackboard) => blackboard.timeout < 5000 }>
                <wait duration={1000}/>
                <functionCall fn={(bb) => { bb.timeout += 1000; }}/>
            </sequence>
            <TestBranch />
        </selector>
    )
}


function TestBranch(props) {
    return (
        <sequence {...props}>
            <wait duration={1000}/>
            <selector>
                <sequence alwaysFail={true}>
                    <ActionConsoleLog txt={'test succeed/fail decorator'}/>
                </sequence>
                <ActionConsoleLog txt={'we failed!'}/>
            </selector>
        </sequence>
    )
}

const main = () => {

    let blackboard = {
        message: 'hello from the blackboard!'
    };

    let treeManager = BTreeManager.getInstance();

    let lastTime;
    function gameLoop(time) {
        if (lastTime != null) {
            const dt = time - lastTime
            BTreeManager.getInstance().update(dt);
        }
        lastTime = time
        window.requestAnimationFrame(gameLoop)
    }
    window.requestAnimationFrame(gameLoop)
    treeManager.start(TestTree, 60, blackboard);

}

main();
