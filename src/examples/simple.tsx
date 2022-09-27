import jsx, {FunctionCall, Lotto, Parallel, Repeat, Selector, Sequence, Wait } from '../'
import {ActionConsoleLog} from "./ActionConsoleLog";
import {BTreeManager} from "../BTreeManager";

const TestTree = (props) => (
    <Selector {...props}>
        <Sequence while={(blackboard) => blackboard.timeout < 5000} >
            <Wait duration={1000}/>
            <FunctionCall fn={(bb) => { bb.timeout += 1000; }}/>
        </Sequence>
        <TestBranch/>
    </Selector>
);


function TestBranch(props) {
    return (
        <Sequence {...props}>
            <Wait duration={1000}/>
            <Selector>
                <Sequence alwaysFail={true}>
                    <ActionConsoleLog txt={'test succeed/fail decorator'}/>
                </Sequence>
                <ActionConsoleLog txt={'we failed!'}/>
            </Selector>
            <Repeat iterations={2}>
                <Parallel>
                    <ActionConsoleLog txt={'called in parallel 1'}/>
                    <ActionConsoleLog txt={'called in parallel 2'}/>
                </Parallel>
            </Repeat>
            <Lotto>
                <ActionConsoleLog txt={'rand choice in lotto 1'}/>
                <ActionConsoleLog txt={'rand choice in lotto 2'}/>
            </Lotto>
        </Sequence>
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

