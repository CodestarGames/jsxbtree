import {NodeState} from "../NodeState";

export abstract class Action {

    abstract props;

    priority: number = 1;
    blackboard: any;

    get isImmediate(): boolean {
        return true;
    }

    // public bind(props:any, gameObject: GameObject | GameObject[], scene?: any) {
    //     this.props = props;
    //     if(Array.isArray(gameObject))
    //         this.gameObjects = gameObject;
    //     else
    //         this.gameObject = gameObject;
    //     this._scene = scene;
    //
    // }

    public perform(): NodeState {
        return this.onPerform();
    }

    get waitForCompletion() : boolean {
        return this.props.waitForCompletion || false;
    }

    // get interruptible() {
    //     return this.props.interruptible || false;
    // }

    onComplete: () => void;

    onPerform(): NodeState {
        return null;
    };

    public succeed(): NodeState {
        return NodeState.SUCCEEDED;
    }

    public fail(): NodeState {
        return NodeState.FAILED;
    }

}


export interface IWaitableAction {
    waitForCompletion?: boolean;
}

export interface IInterruptibleAction {
    interruptible?: Function | boolean;
}
