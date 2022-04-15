import {LeafNode} from "../nodes/LeafNode";
import {NodeState} from "../nodeState";

export class ActionNodeBase extends LeafNode {
    private updatePromiseStateResult: any;
    private isUsingUpdatePromise: boolean;

    constructor(readonly ctor, readonly props) {
        super(props);
    }

    getCaption(): string {
        return `Action`;
    }

    type = 'action'

    reset() {
        // Reset the state of this node.
        this.setState(NodeState.READY);

        // There is no longer an update promise that we care about.
        this.isUsingUpdatePromise = false;
        this.updatePromiseStateResult = null;
    }

    onUpdate() {


        // If the result of this action depends on an update promise then there is nothing to do until
        // it resolves, unless there has been a value set as a result of the update promise resolving.
        if (this.isUsingUpdatePromise) {
            // Check whether the update promise has resolved with a state value.
            if (this.updatePromiseStateResult) {

                // Set the state of this node to match the state returned by the promise.
                this.setState(this.updatePromiseStateResult);
            }

            return;
        }

        // Validate the action.
        // this._validateAction(action);

        // Call the action 'onUpdate' function, the result of which may be:
        // - The finished state of this action node.
        // - A promise to return a finished node state.
        // - Undefined if the node should remain in the running state.
        let Action = new this.ctor();
        Action.props = this.props;
        Action.blackboard = this.blackboard;
        // let gameObject = this.props.gameObject;
        //
        // if (typeof (this.props.gameObject) === 'function') {
        //     gameObject = this.props.gameObject(this.scene.bTreeManager.gameState, this.scene);
        // }
        //
        // Action.bind(this.props, gameObject, this.scene);

        // if ((Action.interruptible instanceof Function && Action.interruptible()) || Action.interruptible === true) {
        //     this.scene.events.once('on-interrupt', Action.onInterrupt, Action);
        // }


        let updateResult;
        if (Action.waitForCompletion === true) {
            updateResult = new Promise<any>(resolve => {

                Action.onComplete = () => {

                    //NOTE: THIS IS A NON-IDEAL FIX, COME BACK TO THIS LATER.
                    //////////////////////////////////////////////////////////
                    if (!this.isUsingUpdatePromise) {
                        return;
                    }

                    if (this.state === NodeState.FAILED) {
                        this.updatePromiseStateResult = NodeState.FAILED;
                        return;
                    }

                    // Set pending update promise state result to be processed on next update.
                    this.updatePromiseStateResult = NodeState.SUCCEEDED;

                    /////////////////////////////////////////////////////////

                    //resolve(NodeState.SUCCEEDED);
                };
                Action.perform();

            });
        } else {
            updateResult = Action.perform();
        }


        if (updateResult instanceof Promise) {
            updateResult.then(
                (result) => {

                    // If 'isUpdatePromisePending' is null then the promise was cleared as it was resolving, probably via an abort of reset.
                    if (!this.isUsingUpdatePromise) {
                        return;
                    }

                    // Set pending update promise state result to be processed on next update.
                    this.updatePromiseStateResult = result;
                },
                (reason) => {
                    // If 'isUpdatePromisePending' is null then the promise was cleared as it was resolving, probably via an abort of reset.
                    if (!this.isUsingUpdatePromise) {
                        return;
                    }

                    // Just throw whatever was returned as the rejection argument.
                    throw reason;
                }
            );

            // This node will be in the 'RUNNING' state until the update promise resolves.
            this.setState(NodeState.RUNNING);

            // We are now waiting for the promise returned by the use to resolve before we know what state this node is in.
            this.isUsingUpdatePromise = true;
        } else {
            // Validate the returned value.
            this._validateUpdateResult(updateResult);

            // Set the state of this node, this may be undefined, which just means that the node is still in the 'RUNNING' state.
            this.setState(updateResult || NodeState.RUNNING);
        }
    }

    _validateUpdateResult(result) {
        switch (result) {
            case NodeState.SUCCEEDED:
            case NodeState.FAILED:
            case undefined:
                return;
            default:
                throw `action '${'test'}' 'onUpdate' returned an invalid response, expected an optional State.SUCCEEDED or State.FAILED value to be returned`;
        }
    }
}
