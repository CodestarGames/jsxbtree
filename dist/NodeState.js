export class NodeState {
    constructor({ succeeded, done }) {
        this.succeeded = succeeded;
        this.done = done;
    }
    static is(value, state) {
        return state.done === value.done && state.succeeded === value.succeeded;
    }
}
NodeState.SUCCEEDED = new NodeState({ succeeded: true, done: true });
NodeState.FAILED = new NodeState({ succeeded: false, done: true });
NodeState.RUNNING = new NodeState({ succeeded: true, done: false });
NodeState.READY = new NodeState({ succeeded: false, done: false });
//# sourceMappingURL=NodeState.js.map