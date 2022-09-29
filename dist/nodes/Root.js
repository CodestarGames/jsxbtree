import { CompositeNode } from "./CompositeNode";
import { NodeState } from "../NodeState";
export class RootNode extends CompositeNode {
    onUpdate() {
        let child = this.children[0];
        // If the child has never been updated or is running then we will need to update it now.
        if (child.is(NodeState.READY) || child.is(NodeState.RUNNING)) {
            // Update the child of this node.
            child.update();
        }
        // The state of the root node is the state of its child.
        this.setState(child.state);
        this.postUpdate();
    }
    getCaption() {
        return "ROOT";
    }
    type = 'root';
}
//# sourceMappingURL=Root.js.map