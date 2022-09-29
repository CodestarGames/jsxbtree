import { LeafNode } from "./LeafNode";
import { NodeState } from "../NodeState";
export class FunctionCallNode extends LeafNode {
    props;
    constructor(props) {
        super(props);
        this.props = props;
    }
    onUpdate() {
        this.props.fn(this.blackboard);
        this.setState(NodeState.SUCCEEDED);
    }
    getCaption() {
        return "FunctionCall";
    }
    type = 'action';
}
//# sourceMappingURL=FunctionCallNode.js.map