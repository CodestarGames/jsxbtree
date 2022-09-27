import {wrapActionNode} from "../index";

let wrappedFn = (node) => {
    console.log(`ActionConsoleLog : ${node.props.txt}`);
    return true;
};

export const ActionConsoleLog = (props) => wrapActionNode('ActionConsoleLog', wrappedFn, props)
