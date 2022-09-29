import { LeafNode } from "../nodes/LeafNode";
import { NodeState } from "../NodeState";
export class ActionNode extends LeafNode {
    wrapperFn;
    props;
    updatePromiseStateResult;
    isUsingUpdatePromise;
    waitForCompletion;
    onComplete;
    constructor(wrapperFn, props, options) {
        super(props);
        this.wrapperFn = wrapperFn;
        this.props = props;
        this.waitForCompletion = options?.waitForCompletion || false;
        this.onComplete = options?.onComplete || (() => { });
    }
    getCaption() {
        return `Action`;
    }
    type = 'action';
    reset() {
        // Reset the state of this node.
        this.setState(NodeState.READY);
        // There is no longer an updateState promise that we care about.
        this.isUsingUpdatePromise = false;
        this.updatePromiseStateResult = null;
    }
    onUpdate() {
        // If the result of this action depends on an updateState promise then there is nothing to do until
        // it resolves, unless there has been a value set as a result of the updateState promise resolving.
        if (this.isUsingUpdatePromise) {
            // Check whether the updateState promise has resolved with a state value.
            if (this.updatePromiseStateResult) {
                // Set the state of this node to match the state returned by the promise.
                this.setState(this.updatePromiseStateResult);
            }
            return;
        }
        let updateResult;
        if (this.waitForCompletion === true) {
            updateResult = new Promise(resolve => {
                this.onComplete = () => {
                    //NOTE: THIS IS A NON-IDEAL FIX, COME BACK TO THIS LATER.
                    //////////////////////////////////////////////////////////
                    if (!this.isUsingUpdatePromise) {
                        return;
                    }
                    if (this.state === NodeState.FAILED) {
                        this.updatePromiseStateResult = NodeState.FAILED;
                        return;
                    }
                    // Set pending updateState promise state result to be processed on next updateState.
                    this.updatePromiseStateResult = NodeState.SUCCEEDED;
                    /////////////////////////////////////////////////////////
                    //resolve(NodeState.SUCCEEDED);
                };
                updateResult = this.wrapperFn(this);
            });
        }
        else {
            updateResult = this.wrapperFn(this);
        }
        if (updateResult instanceof Promise) {
            updateResult.then((result) => {
                // If 'isUpdatePromisePending' is null then the promise was cleared as it was resolving, probably via an abort of reset.
                if (!this.isUsingUpdatePromise) {
                    return;
                }
                // Set pending updateState promise state result to be processed on next updateState.
                this.updatePromiseStateResult = result;
            }, (reason) => {
                // If 'isUpdatePromisePending' is null then the promise was cleared as it was resolving, probably via an abort of reset.
                if (!this.isUsingUpdatePromise) {
                    return;
                }
                // Just throw whatever was returned as the rejection argument.
                throw reason;
            });
            // This node will be in the 'RUNNING' state until the updateState promise resolves.
            this.setState(NodeState.RUNNING);
            // We are now waiting for the promise returned by the use to resolve before we know what state this node is in.
            this.isUsingUpdatePromise = true;
        }
        else {
            // Validate the returned value.
            this._validateUpdateResult(updateResult);
            if (typeof updateResult === 'boolean')
                updateResult = updateResult === true ? NodeState.SUCCEEDED : NodeState.FAILED;
            // Set the state of this node, this may be undefined, which just means that the node is still in the 'RUNNING' state.
            this.setState(updateResult || NodeState.RUNNING);
        }
    }
    _validateUpdateResult(result) {
        switch (result) {
            case NodeState.SUCCEEDED:
            case NodeState.FAILED:
            case true:
            case false:
                return;
            default:
                throw `action '${'test'}' 'onUpdate' returned an invalid response, expected an optional State.SUCCEEDED or State.FAILED value to be returned`;
        }
    }
}
//# sourceMappingURL=ActionNode.js.map