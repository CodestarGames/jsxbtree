import {CompositeNode, ICompositeNodeParams} from "./CompositeNode";
import {NodeState} from "../NodeState";

export interface IRepeatParams extends ICompositeNodeParams {
    iterations?: number | (() => number);
}

export class RepeatNode extends CompositeNode {
    private _iterations: any;
    get _child() {
        return this.children[0];
    }
    private currentIterationCount: number;
    private targetIterationCount: number | null;

    /**
     * A REPEAT node.
     * The node has a single child which can have:
     * -- A number of iterations for which to Repeat the child node.
     * -- An infinite Repeat loop if neither an iteration count or a Condition function is defined.
     * The REPEAT node will stop and have a 'FAILED' state if its child is ever in a 'FAILED' state after an updateState.
     * The REPEAT node will attempt to move on to the next iteration if its child is ever in a 'SUCCEEDED' state.
     * @param props
     */
    constructor(readonly props: IRepeatParams) {
        super(props);

        /**
         * The number of target iterations to make.
         */
        this.targetIterationCount = null;

        /**
         * The current iteration count.
         */
        this.currentIterationCount = 0;

    }

    _canIterate() {
        if (this.targetIterationCount !== null) {
            // We can iterate as long as we have not reached our target iteration count.
            return this.currentIterationCount < this.targetIterationCount;
        }

        // If neither an iteration count or a Condition function were defined then we can iterate indefinitely.
        return true;
    }

    onUpdate() {
        // If this node is in the READY state then we need to reset the child and the target iteration count.
        if (this.is(NodeState.READY)) {
            // Reset the child node.
            this._child.reset();

            // Set the target iteration count.
            this._setTargetIterationCount();
        }

        // Do a check to see if we can iterate. If we can then this node will move into the 'RUNNING' NodeState.
        // If we cannot iterate then we have hit our target iteration count, which means that the node has succeeded.
        if (this._canIterate()) {
            // This node is in the running NodeState and can do its initial iteration.
            this.setState(NodeState.RUNNING);

            // We may have already completed an iteration, meaning that the child node will be in the SUCCEEDED state.
            // If this is the case then we will have to reset the child node now.
            if (this._child.state === NodeState.SUCCEEDED) {
                this._child.reset();
            }

            // Update the child of this node.
            this._child.update();

            // If the child moved into the FAILED NodeState when we updated it then there is nothing left to do and this node has also failed.
            // If it has moved into the SUCCEEDED NodeState then we have completed the current iteration.
            if (this._child.state === NodeState.FAILED) {
                // The child has failed, meaning that this node has failed.
                this.setState(NodeState.FAILED);

                return;
            } else if (this._child.state === NodeState.SUCCEEDED) {
                // We have completed an iteration.
                this.currentIterationCount += 1;
            }
        } else {
            // This node is in the 'SUCCEEDED' NodeState as we cannot iterate any more.
            this.setState(NodeState.SUCCEEDED);
        }
    }

    _setTargetIterationCount() {
        this._iterations = typeof this.props.iterations === "function" ? this.props.iterations() : this.props.iterations;

        // Are we dealing with a finite number of iterations?
        if (typeof this._iterations === "number") {
            // If we have maximumIterations defined then we will want a random iteration count bounded by iterations and maximumIterations.
            this.targetIterationCount = this._iterations;
        } else {
            this.targetIterationCount = null;
        }
    }

    getCaption(): string {
        return "REPEAT";
    }

    type = 'repeat'
}
