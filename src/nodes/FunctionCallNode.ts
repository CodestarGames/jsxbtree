import {LeafNode} from "./LeafNode";
import {BTreeCallbackFn} from "./Decorators/BTreeAttribute";
import {IBaseActionProps} from "../index";
import {NodeState} from "../NodeState";
import {IDecoratorsFromJSXProps} from "./Node";

export class FunctionCallNode extends LeafNode {

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

export interface IFunctionCallProps extends IDecoratorsFromJSXProps {
    parentUid?,
    fn: BTreeCallbackFn
}
