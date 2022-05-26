import {LeafNode} from "./LeafNode";
import {IBaseActionProps} from "../index";
import {NodeState} from "../NodeState";


export class WaitNode extends LeafNode {
    private initialUpdateTime: number;
    private duration: number;
    constructor(public props: IWaitParams) {
        super(props);
    }

    onUpdate() {

        // If this node is in the READY state then we need to set the initial updateState time.
        if (this.is(NodeState.READY) || this.initialUpdateTime === null) {
            //get the duration
            this.duration = typeof this.props.duration === 'function' ? this.props.duration(this.blackboard) :  this.props.duration

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

    getCaption(): string {
        return `WAIT ${this.duration}ms`;
    }

    type = 'wait'
}

export interface IWaitParams extends IBaseActionProps{
    duration: number | ((bb: any) => number);
}
