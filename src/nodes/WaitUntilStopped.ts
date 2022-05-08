import {LeafNode} from "./LeafNode";
import {NodeState} from "../NodeState";


export class WaitUntilStoppedNode extends LeafNode {
    onUpdate() {

        // If this node is in the READY state then we need to set the initial updateState time.
        if (this.is(NodeState.READY)) {

            // The node is now running until we finish waiting.
            this.setState(NodeState.RUNNING);
        }

    }

    getCaption(): string {
        return `WAIT ${this.props.duration}ms`;
    }

    type = 'wait'
}

