import {LeafNode} from "./LeafNode";
import {IBaseActionProps} from "../index";
import {NodeState} from "../nodeState";


export class WaitNode extends LeafNode {
    private initialUpdateTime: number;
    constructor(public props: IWaitParams) {
        super(props);
    }

    onUpdate() {

        // If this node is in the READY state then we need to set the initial update time.
        if (this.is(NodeState.READY) || this.initialUpdateTime === null) {
            // Set the initial update time.
            this.initialUpdateTime = new Date().getTime();

            // The node is now running until we finish waiting.
            this.setState(NodeState.RUNNING);
        }

        // Have we waited long enough?
        if (new Date().getTime() >= (this.initialUpdateTime + this.props.duration)) {
            // We have finished waiting!
            this.setState(NodeState.SUCCEEDED);
            this.initialUpdateTime = null;
        }
    }

    getCaption(): string {
        return `WAIT ${this.props.duration}ms`;
    }

    type = 'wait'
}

export interface IWaitParams extends IBaseActionProps{
    duration: number;
}
