/** @jsxRuntime classic */
/** @jsx BtreeJSX */
import BtreeJSX, {wrapActionNode, Selector, Wait, Sequence, FunctionCall, Repeat, Parallel, Lotto} from "jsxbtree";

let wrappedFn = (node) => {
    console.log(`ActionConsoleLog : ${node.props.txt}`);
    return true;
};

export const ActionConsoleLog = (props) => wrapActionNode('ActionConsoleLog', wrappedFn, props);

export const ExampleTree = (props) => (
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
