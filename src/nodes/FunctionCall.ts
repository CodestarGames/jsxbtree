import {NodeState} from "../nodes/NodeState";
import {LeafNode} from "./LeafNode";
import {IBaseActionProps} from "./Action";
import {BTreeCallbackFn} from "./Decorators/BTreeAttribute";

export class FunctionCall extends LeafNode {

    constructor(readonly props: IFunctionCallProps) {
        super(props);
    }

    onUpdate() {
        this.props.fn(this.blackboard);
        this.setState(NodeState.SUCCEEDED);
    }

    getCaption(): string {
        return "FunctionCall";
    }

    type = 'action'
}

export interface IFunctionCallProps extends IBaseActionProps {
    fn: BTreeCallbackFn
}
