import { LeafNode } from "./LeafNode";
import { NodeState } from "../NodeState";
/**
 * A Condition leaf node.
 * This will succeed or fail immediately based on a board predicate, without moving to the 'RUNNING' state.
 * **/
export class ConditionNode extends LeafNode {
    constructor() {
        super(...arguments);
        this.type = 'condition';
    }
    onUpdate() {
        if (this.props.eq(this.blackboard) === true)
            this.setState(NodeState.SUCCEEDED);
        else
            this.setState(NodeState.FAILED);
    }
    getCaption() {
        return "CONDITION";
    }
}
//# sourceMappingURL=Condition.js.map