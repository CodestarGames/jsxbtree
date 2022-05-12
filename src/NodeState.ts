export class NodeState {
    static SUCCEEDED = new NodeState({succeeded: true, done: true});
    static FAILED = new NodeState({succeeded: false, done: true});
    static RUNNING = new NodeState({succeeded: true, done: false});
    static READY = new NodeState({succeeded: false, done: false});

    static is(value: NodeState, state: NodeState) {
        return state.done === value.done && state.succeeded === value.succeeded;
    }

    public succeeded: boolean;
    public done: boolean;

    constructor({succeeded, done}) {
        this.succeeded = succeeded;
        this.done = done;
    }

}
