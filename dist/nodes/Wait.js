import { LeafNode } from "./LeafNode";
import { NodeState } from "../NodeState";
export class WaitNode extends LeafNode {
    props;
    initialUpdateTime;
    duration;
    constructor(props) {
        super(props);
        this.props = props;
    }
    onUpdate() {
        // If this node is in the READY state then we need to set the initial updateState time.
        if (this.is(NodeState.READY) || this.initialUpdateTime === null) {
            //get the duration
            this.duration = typeof this.props.duration === 'function' ? this.props.duration(this.blackboard) : this.props.duration;
            // Set the initial updateState time.
            this.initialUpdateTime = new Date().getTime();
            // The node is now running until we finish waiting.
            this.setState(NodeState.RUNNING);
        }
        // Have we waited long enough?
        if (new Date().getTime() >= (this.initialUpdateTime + this.duration)) {
            // We have finished waiting!
            this.setState(NodeState.SUCCEEDED);
            this.initialUpdateTime = null;
        }
    }
    getCaption() {
        return `WAIT ${this.duration}ms`;
    }
    type = 'wait';
}
//# sourceMappingURL=Wait.js.map