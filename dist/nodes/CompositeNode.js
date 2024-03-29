import { Node } from "./Node";
import { NodeState } from "../NodeState";
export class CompositeNode extends Node {
    constructor(props) {
        super(props);
        this.props = props;
        this.isLeafNode = () => false;
    }
    abort() {
        // There is nothing to do if this node is not in the running state.
        if (!this.is(NodeState.RUNNING)) {
            return;
        }
        // Abort any child 
        this.children.forEach((child) => child.abort());
        // Reset the state of this node.
        this.reset();
        // Try to get the exitState decorator for this node.
        const exitDecorator = this.getDecorator("exit");
        // Call the exitState decorator function if it exists.
        if (exitDecorator) {
            exitDecorator.callExecutionFunc(this.blackboard);
        }
    }
    reset() {
        // Reset the state of this node.
        this.setState(NodeState.READY);
        // Reset the state of any child 
        this.children.forEach(child => child.reset());
    }
}
//# sourceMappingURL=CompositeNode.js.map