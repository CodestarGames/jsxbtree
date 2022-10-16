import { LeafNode } from "./LeafNode";
import { NodeState } from "../NodeState";
export class FunctionCallNode extends LeafNode {
    constructor(props) {
        super(props);
        this.props = props;
        this.type = 'action';
    }
    onUpdate() {
        this.props.fn(this.blackboard);
        this.setState(NodeState.SUCCEEDED);
    }
    getCaption() {
        return "FunctionCall";
    }
}
//# sourceMappingURL=FunctionCallNode.js.map