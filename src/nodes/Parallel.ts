import {NodeState} from "./NodeState";
import {CompositeNode} from "./CompositeNode";

export class ParallelNode extends CompositeNode {

    onUpdate() {
        // Keep a count of the number of succeeded child 
        let succeededCount = 0;

        let hasChildFailed = false;

        // Iterate over all of the children of this node.
        for (const child of this.children) {
            // If the child has never been updated or is running then we will need to update it now.
            if (child.is(NodeState.READY) || child.is(NodeState.RUNNING)) {
                // Update the child of this node.
                child.update();
            }

            // If the current child has a state of 'SUCCEEDED' then we should move on to the next child.
            if (child.is(NodeState.SUCCEEDED)) {
                // The child node has succeeded, keep track of this to determine if all children have.
                succeededCount++;

                // The child node succeeded, but we have not finished checking every child node yet.
                continue;
            }

            // If the current child has a state of 'FAILED' then this node is also a 'FAILED' node.
            if (child.is(NodeState.FAILED)) {
                hasChildFailed = true;

                // There is no need to check the rest of the children.
                break;
            }

            // The node should be in the 'RUNNING' state.
            if (child.is(NodeState.RUNNING) === false) {

                // The child node was not in an expected state.
                throw "Error: child node was not in an expected state.";
            }
        }

        if (hasChildFailed) {
            // This node is a 'FAILED' node.
            this.setState(NodeState.FAILED);

            // Abort every running child.
            for (const child of this.children) {
                if (child.is(NodeState.RUNNING)) {
                    child.abort();
                }
            }
        } else {
            // If all children have succeeded then this node has also succeeded, otherwise it is still running.
            this.setState(succeededCount === this.children.length ? NodeState.SUCCEEDED : NodeState.RUNNING);
        }
    }

    getCaption(): string {
        return "PARALLEL";
    }

    type = 'parallel'
}
