import { LeafNode } from "./LeafNode";
import { NodeState } from "../NodeState";
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
    getCaption() {
        return "CONDITION";
    }
    type = 'condition';
}
//# sourceMappingURL=Condition.js.map