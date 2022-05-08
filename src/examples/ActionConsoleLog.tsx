import {Action} from "../nodes/Action";
import {BTreeCallbackFn} from "../nodes/Decorators/Decorator";
import {IBaseActionProps, wrapActionNode} from "../index";
import {NodeState} from "../NodeState";

class ActConsoleLog extends Action {
    props: IConsoleLogParams;

    get waitForCompletion() {
        return false;
    };

    onPerform(): NodeState {
        let txt;
        if(typeof (this.props.txt) === 'function')
            txt = this.props.txt(this.blackboard);
        else
            txt = this.props.txt;

        console.log(`ActionConsoleLog : ${txt}`);

        return this.succeed();
    }
}


export interface IConsoleLogParams extends IBaseActionProps {
    /**
     * The string to log on the console.
     */
    txt: string | BTreeCallbackFn

}

export default function ActionConsoleLog(props: IConsoleLogParams) {
    return wrapActionNode(ActConsoleLog, props);
}
