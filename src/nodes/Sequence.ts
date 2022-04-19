import {CompositeNode} from "./CompositeNode";
import {NodeState} from "../NodeState";


export class SequenceNode extends CompositeNode {

    onUpdate() {
        // Iterate over all of the children of this node.
        for (const child of this.children) {
            // If the child has never been updated or is running then we will need to update it now.
            if (child.is(NodeState.READY) || child.is(NodeState.RUNNING)) {
                // Update the child of this node.
                child.update();
            }

            // If the current child has a state of 'SUCCEEDED' then we should move on to the next child.
            if (child.is(NodeState.SUCCEEDED)) {
                // Find out if the current child is the last one in the Sequence.
                // If it is then this Sequence node has also succeeded.
                if (this.children.indexOf(child) === this.children.length - 1) {
                    // This node is a 'SUCCEEDED' node.
                    this.setState(NodeState.SUCCEEDED);

                    // There is no need to check the rest of the Sequence as we have completed it.
                    return;
                } else {
                    // The child node succeeded, but we have not finished the Sequence yet.
                    continue;
                }
            }

            // If the current child has a state of 'FAILED' then this node is also a 'FAILED' node.
            if (child.is(NodeState.FAILED)) {
                // This node is a 'FAILED' node.
                this.setState(NodeState.FAILED);

                // There is no need to check the rest of the Sequence.
                return;
            }

            // The node should be in the 'RUNNING' state.
            if (child.is(NodeState.RUNNING)) {
                // This node is a 'RUNNING' node.
                this.setState(NodeState.RUNNING);

                // There is no need to check the rest of the Sequence as the current child is still running.
                return;
            }


            // The child node was not in an expected state.
            throw "Error: child node was not in an expected state.";
        }
    }

    getCaption(): string {
        return "SEQUENCE";
    }

    type = 'sequence'
}

