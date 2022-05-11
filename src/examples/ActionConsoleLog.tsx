import {BTreeCallbackFn, IBaseActionProps, NodeState, wrapActionNode} from "../index";

export interface IConsoleLogParams extends IBaseActionProps {
    /**
     * The string to log on the console.
     */
    txt: string | BTreeCallbackFn
}

export default function ActionConsoleLog(props: IConsoleLogParams) {

    return wrapActionNode('ActionConsoleLog', (node) => {

        let txt;
        if (typeof (node.props.txt) === 'function')
            txt = node.props.txt(node.blackboard);
        else
            txt = node.props.txt;

        console.log(`ActionConsoleLog : ${txt}`);

        return true;

    }, props);

}
