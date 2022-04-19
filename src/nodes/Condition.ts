
import {LeafNode} from "./LeafNode";
import {BTreeCallbackFn} from "./Decorators/BTreeAttribute";
import {IBaseActionProps} from "../index";
import {NodeState} from "../NodeState";

/**
 * A Condition leaf node.
 * This will succeed or fail immediately based on a board predicate, without moving to the 'RUNNING' state.
 * **/
export class ConditionNode extends LeafNode {

    onUpdate() {

        if (this.props.eq(this.blackboard) === true)
            this.setState(NodeState.SUCCEEDED);
        else
            this.setState(NodeState.FAILED);
    }

    getCaption(): string {
        return "CONDITION";
    }

    type = 'condition'
}

export interface IConditionParams extends IBaseActionProps{
     eq: BTreeCallbackFn;
}

